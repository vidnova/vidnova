import { WsGateway } from '../../gateway/ws.gateway';
import { ExternalServicesMessageRouteCommand } from './external-services-message-route.command';
import { Injectable, Logger } from '@nestjs/common';
import { JobTypes } from '@vidnova/shared';

@Injectable()
export class ExternalServicesMessageRoute {
  private logger = new Logger(ExternalServicesMessageRoute.name);

  constructor(private readonly wsGateway: WsGateway) {}

  async execute(command: ExternalServicesMessageRouteCommand) {
    const isChatActive = await this.isChatActive(command.payload.chatId);
    if (!isChatActive) {
      this.logger.log(
        `No active connections for chat ${command.payload.chatId}, skipping message`,
      );
      return;
    }

    if (command.jobType === JobTypes.SEND_MESSAGE) {
      this.processGetMessage(command);
    }
  }

  private processGetMessage(command: ExternalServicesMessageRouteCommand) {
    if (command.payload) {
      this.logger.log('Sending message');
      this.wsGateway.sendMessage(
        command.payload.chatId,
        command.jobType,
        command.payload,
      );
    }
  }

  private async isChatActive(chatId: string): Promise<boolean> {
    if (!this.wsGateway.server) {
      this.logger.error('No WebSocket server found');
      return false;
    }
    return !!(await this.wsGateway.server.in(chatId).fetchSockets()).length;
  }
}
