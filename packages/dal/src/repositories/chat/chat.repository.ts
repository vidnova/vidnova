import { IChatRepository } from './chat-repository.interface';
import { Chat } from './chat.entity';
import { PrismaService } from '../shared';
import { ChatMemberRole, ChatType } from '@ecorally/shared';
import { Injectable } from '@nestjs/common';
import { ChatQueries } from './chat.query';
import { ChatMember } from './chat-member.vo';

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(chat: Chat): Promise<Chat> {
    const persistedChatData = await this.prismaService.chat.create({
      data: {
        id: chat.id,
        type: chat.type,
        name: chat.name,
        description: chat.description,
        imageUrl: chat.imageUrl,
        ...(chat.members?.length && {
          members: {
            create: chat.members.map((member) => ({
              userId: member.id,
              role: member.role,
            })),
          },
        }),
      },
      select: ChatQueries.SELECT_FIELDS_WITH_MEMBERS,
    });

    const members = persistedChatData.members.map((member) =>
      ChatMember.fromPersistence({
        id: member.user.id,
        firstName: member.user.firstName,
        lastName: member.user.lastName,
        imageUrl: member.user.imageUrl,
        role: member.role as ChatMemberRole,
      }),
    );

    return Chat.fromPersistence({
      ...persistedChatData,
      type: persistedChatData.type as ChatType,
      members,
    });
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

  async findById(id: string, includeMembers?: boolean): Promise<Chat | null> {
    const chat = await this.prismaService.chat.findUnique({
      where: { id },
      select: includeMembers ? ChatQueries.SELECT_FIELDS_WITH_MEMBERS : ChatQueries.SELECT_FIELDS,
    });

    if (!chat) return null;

    const members =
      includeMembers && 'members' in chat && Array.isArray(chat.members)
        ? chat.members.map((member) =>
            ChatMember.fromPersistence({
              id: member.user.id,
              firstName: member.user.firstName,
              lastName: member.user.lastName,
              imageUrl: member.user.imageUrl,
              role: member.role as ChatMemberRole,
            }),
          )
        : undefined;

    return Chat.fromPersistence({
      ...chat,
      type: chat.type as ChatType,
      members,
    });
  }

  async addMembersToChat(members: ChatMember[], chatId: string): Promise<void> {
    const data = members.map((member) => ({
      userId: member.id,
      role: member.role,
      chatId,
    }));

    await this.prismaService.chatMember.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
