import { Message } from './message.entity';
import { MessageSender } from './message-sender.vo';
import { MessageReaction } from './message-reaction.vo';
import { MessageAttachment } from './message-attachment.vo';
import { MessageReply } from './message-reply.vo';
import { MessageType } from '@ecorally/shared';

export class MessageMapper {
  static toDomain(message: any): Message {
    const sender = MessageSender.fromPersistence(message.sender);
    const reactions = message.reactions.map(MessageReaction.fromPersistence);
    const attachments = message.attachments.map(MessageAttachment.fromPersistence);
    const replyTo = message.replyTo ? MessageReply.fromPersistence(message.replyTo) : null;

    return Message.fromPersistence({
      ...message,
      type: message.type as MessageType,
      sender,
      replyTo,
      attachments,
      reactions,
    });
  }
}
