import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '@ecorally/shared';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger();

  constructor(private readonly authService: AuthService) {}

  @WebSocketServer()
  server!: Server;

  async handleConnection(client: Socket) {
    const accessToken = client.handshake.headers.cookie;
    if (!accessToken) {
      client.disconnect();
      return;
    }

    const userId = this.authService.verifyToken(accessToken);
    if (!userId) {
      client.disconnect();
      return;
    }

    this.logger.log(`New connection from ${client.id}`);

    await client.join(userId);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`New disconnect from ${client.id}`);
  }

  sendMessage<T>(userId: string, event: string, data: T) {
    this.server.to(userId).emit(event, data);
  }
}
