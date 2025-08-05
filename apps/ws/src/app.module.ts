import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { QueueNames, SharedModule } from '@ecorally/shared';
import { DalModule } from '@ecorally/dal';
import { MessageModule } from './message/message.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    GatewayModule,
    SharedModule,
    DalModule,
    MessageModule,
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: QueueNames.MESSAGE_QUEUE,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
