import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { SharedModule } from '@ecorally/shared';

@Module({
  imports: [GatewayModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
