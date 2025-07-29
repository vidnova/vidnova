import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '@ecorally/shared';
import { Inject, Logger } from '@nestjs/common';
import { IChatRepository } from '@ecorally/dal';

@WebSocketGateway()
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger();
  // TODO: make subscriptions storage in redis
  private subscriptions = new Map<string, Set<string>>();

  constructor(
    private readonly authService: AuthService,
    @Inject('CHAT_REPOSITORY') private readonly chatRepository: IChatRepository,
  ) {}

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

    const chats = await this.chatRepository.findChatsByUserId(userId);
    const chatIds = chats.map((chat) => chat.id);
    this.subscriptions.set(client.id, new Set(chatIds));

    this.logger.log(
      `Client ${client.id} (user ${userId}) subscribed to chats: ${chatIds.join(', ')}`,
    );

    await client.join(userId);

    client.emit('subscribed', { chatIds });
  }

  handleDisconnect(client: Socket) {
    this.subscriptions.delete(client.id);
    this.logger.log(`New disconnect from ${client.id}`);
  }

  sendMessage<T>(chatId: string, event: string, data: T) {
    this.server.to(chatId).emit(event, data);
  }
}
