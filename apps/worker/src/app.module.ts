import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BullMqService, QueueNames } from '@ecorally/shared';
import Redis from 'ioredis';
import { RedisSubscribers } from './events/redis-subscribers';
import { MessageProcessor } from './processors/message.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: {
        validate: (config: Record<string, any>) => {
          if (!config.REDIS_HOST || !config.REDIS_PORT) {
            throw new Error(
              'REDIS_HOST and REDIS_PORT must be defined in environment variables',
            );
          }
          return config;
        },
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: QueueNames.MESSAGE_QUEUE,
    }),
  ],
  providers: [
    {
      provide: 'REDIS_SUB_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('RedisSubClient');
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
    {
      provide: 'PUB_SUB_REDIS',
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('RedisPubClient');
        try {
          const client = new Redis({
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
            retryStrategy: (times) => Math.min(times * 50, 2000),
          });
          await client.ping();
          logger.log('Redis publication client connected');
          return client;
        } catch (error) {
          logger.error('Failed to connect Redis publication client', error);
          throw error;
        }
      },
      inject: [ConfigService],
    },
    RedisSubscribers,
    MessageProcessor,
    BullMqService,
  ],
})
export class AppModule {}
