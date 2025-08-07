import { IChatRepository } from './chat-repository.interface';
import { Chat } from './chat.entity';
import { PrismaService } from '../shared';
import { ChatMemberRole, ChatType } from '@vidnova/shared';
import { Injectable } from '@nestjs/common';
import { ChatQueries } from './chat.query';
import { ChatMember } from './chat-member.vo';
import { ChatPreviewDto } from './chat.dto';
import { ChatMapper } from './chat.mapper';

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
        ...member,
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
              ...member,
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

  async deleteChatMemberByUserAndChatIds(userId: string, chatId: string) {
    await this.prismaService.chatMember.delete({ where: { userId_chatId: { userId, chatId } } });
  }

  async findMemberByUserAndChatIds(userId: string, chatId: string): Promise<ChatMember | null> {
    const persistedMemberData = await this.prismaService.chatMember.findFirst({
      where: {
        userId: userId,
        chatId: chatId,
      },
      include: { user: true },
    });

    if (!persistedMemberData) return null;

    return ChatMember.fromPersistence({
      ...persistedMemberData,
      id: persistedMemberData.user.id,
      firstName: persistedMemberData.user.firstName,
      lastName: persistedMemberData.user.lastName,
      role: persistedMemberData.role as ChatMemberRole,
      imageUrl: persistedMemberData.user.imageUrl,
    });
  }

  async updateChatMember(
    userId: string,
    chatId: string,
    member: Partial<ChatMember>,
  ): Promise<ChatMember> {
    const persistedChatMemberData = await this.prismaService.chatMember.update({
      where: {
        userId_chatId: {
          chatId,
          userId,
        },
      },
      data: {
        role: member.role,
        isDeleted: member.isDeleted,
        deletedAt: member.deletedAt,
      },
      include: { user: true },
    });

    return ChatMember.fromPersistence({
      ...persistedChatMemberData,
      id: persistedChatMemberData.user.id,
      firstName: persistedChatMemberData.user.firstName,
      lastName: persistedChatMemberData.user.lastName,
      role: persistedChatMemberData.role as ChatMemberRole,
      imageUrl: persistedChatMemberData.user.imageUrl,
    });
  }

  getChatOwnersCount(chatId: string): Promise<number> {
    return this.prismaService.chat.count({ where: { id: chatId } });
  }

  async updateChat(chat: Chat): Promise<Chat> {
    const persistedChatData = await this.prismaService.chat.update({
      where: { id: chat.id },
      data: {
        imageUrl: chat.imageUrl,
        name: chat.name,
        description: chat.description,
        isDeleted: chat.isDeleted,
        deletedAt: chat.deletedAt,
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

  async findChatsByUserId(userId: string): Promise<ChatPreviewDto[]> {
    const persistedChatsData = await this.prismaService.chat.findMany({
      where: {
        members: {
          some: {
            userId,
            isDeleted: false,
          },
        },
        isDeleted: false,
      },
      select: ChatQueries.SELECT_FIELDS_WITH_MEMBERS,
    });

    return persistedChatsData.map((chat) =>
      ChatMapper.toPreviewDto({ ...chat, type: chat.type as ChatType }, userId),
    );
  }
}
