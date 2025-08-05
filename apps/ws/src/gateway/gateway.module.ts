import { Logger, Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  providers: [
    WsGateway,
    {
      provide: 'REDIS_PUB_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('RedisPubClient');
        try {
          const client = new Redis({
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
            retryStrategy: (times) => Math.min(times * 50, 2000),
          });
          await client.ping();
          logger.log('Redis subscription client connected');
          return client;
        } catch (error) {
          logger.error('Failed to connect Redis subscription client', error);
          throw error;
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [WsGateway],
})
export class GatewayModule {}
