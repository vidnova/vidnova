import { MessageSender } from '../value-objects/message-sender.vo';
import { MessageReaction } from '../value-objects/message-reaction.vo';

export class MessageReactionMapper {
  static toDomainMessageReaction(messageReaction: any): MessageReaction {
    const user = MessageSender.fromPersistence(messageReaction.user);

    return MessageReaction.fromPersistence({
      ...messageReaction,
      user,
    });
  }
}
