import { Chat } from './chat.entity';
import { ChatMember } from './chat-member.vo';
import { ChatMemberRole } from '@ecorally/shared';

export interface IChatRepository {
  create(chat: Chat): Promise<Chat>;

  findDirectChat(firstUserId: string, secondUserId: string): Promise<Chat | null>;

  findById(chatId: string, includeMembers?: boolean): Promise<Chat | null>;

  addMembersToChat(members: ChatMember[], chatId: string): Promise<void>;

  deleteChatMemberByUserAndChatIds(userId: string, chatId: string): Promise<void>;

  findMemberByUserAndChatIds(userId: string, chatId: string): Promise<ChatMember | null>;

  updateChatMemberRole(
    userId: string,
    chatId: string,
    newRole: ChatMemberRole,
  ): Promise<ChatMember>;

  getChatOwnersCount(chatId: string): Promise<number>;

  updateChat(chat: Chat): Promise<Chat>;
}
