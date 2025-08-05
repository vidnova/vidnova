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

@WebSocketGateway({
  cors: {
    origin: ['*'],
    credentials: true,
  },
})
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
    try {
      const cookies = client.handshake.headers.cookie;
      if (!cookies) {
        client.disconnect();
        this.logger.log('No cookies provided');
        return;
      }

      const tokenCookie = cookies
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith('accessToken='));

      if (!tokenCookie) {
        client.disconnect();
        this.logger.log('No access token found');
        return;
      }

      const token = tokenCookie.split('=')[1];

      const userId = this.authService.verifyToken(token);
      if (!userId) {
        client.disconnect();
        this.logger.log('User not found');
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
      for (const chatId of chatIds) {
        await client.join(chatId);
      }

      client.emit('subscribed', { chatIds });
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.subscriptions.delete(client.id);
    this.logger.log(`New disconnect from ${client.id}`);
  }

  sendMessage<T>(chatId: string, event: string, data: T) {
    this.server.to(chatId).emit(event, data);
  }
}
