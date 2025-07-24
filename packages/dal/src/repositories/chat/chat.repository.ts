import { IChatRepository } from './chat-repository.interface';
import { Chat } from './chat.entity';
import { PrismaService } from '../shared';
import { ChatType } from '@ecorally/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(private readonly prismaService: PrismaService) {
  }

  async create(chat: Chat): Promise<Chat> {
    const createdChat = await this.prismaService.chat.create({
      data: {
        id: chat.id,
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

  async findDirectChat(firstUserId: string, secondUserId: string): Promise<Chat | null> {
    const chat = await this.prismaService.chat.findFirst({
      where: {
        type: ChatType.DIRECT,
        AND: [
          {
            members: {
              some: { userId: firstUserId },
            },
          },
          {
            members: {
              some: { userId: secondUserId },
            },
          },
        ],
      },
    });

    if (!chat) return null;

    return Chat.fromPersistence({ ...chat, type: chat.type as ChatType });
  }
}
