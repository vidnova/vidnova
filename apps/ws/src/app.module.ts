import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { SharedModule } from '@ecorally/shared';
import { DalModule } from '@ecorally/dal';
import { MessageModule } from './message/message.module';

@Module({
  imports: [GatewayModule, SharedModule, DalModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
