import { MessageSender } from '../value-objects/message-sender.vo';
import { MessageReaction } from '../value-objects/message-reaction.vo';

export class MessageReactionWithUser {
  constructor(
    public readonly id: string,
    public readonly emoji: string,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly user: MessageSender,
  ) {}

  static fromReactionAndUser(
    reaction: MessageReaction,
    user: MessageSender,
  ): MessageReactionWithUser {
    return new MessageReactionWithUser(
      reaction.id,
      reaction.emoji,
      reaction.userId,
      reaction.createdAt,
      user,
    );
  }
}
