import { Chat } from './chat.entity';
import { ChatMember } from './chat-member.vo';

export interface IChatRepository {
  create(chat: Chat): Promise<Chat>;

  findDirectChat(firstUserId: string, secondUserId: string): Promise<Chat | null>;

  findById(chatId: string, includeMembers?: boolean): Promise<Chat | null>;

  addMembersToChat(members: ChatMember[], chatId: string): Promise<void>;
}
