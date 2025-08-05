import { Module } from '@nestjs/common';
import { MessageWorker } from './services/web-socket.worker';
import { ExternalServicesMessageRoute } from './use-cases/external-services-message-route';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [GatewayModule],
  providers: [MessageWorker, ExternalServicesMessageRoute],
  exports: [ExternalServicesMessageRoute],
})
export class MessageModule {}
