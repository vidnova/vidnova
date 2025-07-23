import { Chat } from './chat.entity';

export interface IChatRepository {
  create(chat: Chat): Promise<Chat>;
}
