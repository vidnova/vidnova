import { Message } from './message.entity';

export interface IMessageRepository {
  createMessage(message: Message): Promise<Message>;
}
