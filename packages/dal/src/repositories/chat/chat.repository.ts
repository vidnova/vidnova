import { IChatRepository } from './chat-repository.interface';
import { Chat } from './chat.entity';
import { PrismaService } from '../shared';
import { ChatType } from '@ecorally/shared';

export class ChatRepository implements IChatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(chat: Chat): Promise<Chat> {
    const createdChat = await this.prismaService.chat.create({
      data: {
        type: chat.type,
        name: chat.name,
        description: chat.description,
        imageUrl: chat.imageUrl,
        members: {
          create: [
            ...chat.members.map((member) => ({
              userId: member.id,
              role: member.role,
            })),
          ],
        },
      },
    });

    return Chat.fromPersistence({ ...createdChat, type: createdChat.type as ChatType });
  }
}
