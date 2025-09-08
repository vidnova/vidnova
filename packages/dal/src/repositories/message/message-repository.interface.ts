import { Message } from './message.entity';
import { GetAllMessagesFilters } from '@vidnova/shared';
import { MessageReaction } from './value-objects/message-reaction.vo';

export interface IMessageRepository {
  createMessage(message: Message): Promise<Message>;

  updateMessage(message: Message): Promise<Message>;

  getAllByChatId(
    chatId: string,
    filters?: GetAllMessagesFilters,
  ): Promise<{ messages: Message[]; hasMore: boolean }>;

  upsertReaction(reaction: MessageReaction): Promise<MessageReaction | null>;

  findMessageById(messageId: string): Promise<Message | null>;

  hideMessageForUser(messageId: string, userId: string): Promise<void>;

  isMessageHiddenForUser(messageId: string, userId: string): Promise<boolean>;

  deleteReaction(messageId: string, userId: string): Promise<void>;
}
