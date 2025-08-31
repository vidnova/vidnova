import { Message } from './message.entity';
import { GetAllMessagesFilters } from '@vidnova/shared';

export interface IMessageRepository {
  createMessage(message: Message): Promise<Message>;

  getAllByChatId(
    chatId: string,
    filters?: GetAllMessagesFilters,
  ): Promise<{ messages: Message[]; hasMore: boolean }>;
}
