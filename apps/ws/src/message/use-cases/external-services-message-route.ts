import { WsGateway } from '../../gateway/ws.gateway';
import { ExternalServicesMessageRouteCommand } from './external-services-message-route.command';
import { Logger } from '@nestjs/common';
import { WebSocketMessageEvents } from '../enums/message-events.enum';

export class ExternalServicesMessageRoute {
  private logger = new Logger(ExternalServicesMessageRoute.name);

  constructor(private readonly wsGateway: WsGateway) {}

  async execute(command: ExternalServicesMessageRouteCommand) {
    const isOnline = await this.connectionExist(command);
    if (!isOnline) {
      this.logger.log(`Connection with ${command.userId} does not exist`);
      return;
    }

    if (command.event === WebSocketMessageEvents.MESSAGES) {
      this.processGetMessage(command);
    }
  }

  private processGetMessage(command: ExternalServicesMessageRouteCommand) {
    if (command.payload) {
      this.logger.log('Sending message');
      this.wsGateway.sendMessage(
        command.chatId,
        command.event,
        command.payload,
      );
    }
  }

  private async connectionExist(
    command: ExternalServicesMessageRouteCommand,
  ): Promise<boolean | undefined> {
    if (!this.wsGateway.server) {
      this.logger.error(
        'No sw server found, unable to check if connection exists',
      );

      return;
    }

    return !!(await this.wsGateway.server.in(command.userId).fetchSockets())
      .length;
  }
}
