import { Message } from '../message.entity';
import { MessageSender } from '../value-objects/message-sender.vo';
import { MessageReaction } from '../value-objects/message-reaction.vo';
import { MessageAttachment } from '../value-objects/message-attachment.vo';
import { MessageReply } from '../value-objects/message-reply.vo';
import { MessageType } from '@vidnova/shared';

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
