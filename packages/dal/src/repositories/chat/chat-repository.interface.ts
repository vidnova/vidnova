import { Chat } from './chat.entity';

export interface IChatRepository {
  create(chat: Chat): Promise<Chat>;

  findDirectChat(firstUserId: string, secondUserId: string): Promise<Chat | null>;
}
