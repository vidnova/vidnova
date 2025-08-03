import { MessageType } from '@ecorally/shared';
import { MessageSender } from './message-sender.vo';
import { MessageReply } from './message-reply.vo';
import { MessageReaction } from './message-reaction.vo';
import { MessageAttachment } from './message-attachment.vo';
import { v4 } from 'uuid';

export class Message {
  constructor(
    private readonly _id: string,
    private readonly _content: string | null,
    private readonly _type: MessageType,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _isUpdated: boolean,
    private readonly _sender: MessageSender,
    private readonly _reactions: MessageReaction[],
    private readonly _attachments: MessageAttachment[],
    private readonly _replyTo: MessageReply | null,
  ) {}

  static create(params: {
    content: string | null;
    type: MessageType;
    sender: MessageSender;
    attachments: MessageAttachment[];
    replyTo: MessageReply | null;
  }): Message {
    return new Message(
      v4(),
      params.content,
      params.type,
      new Date(),
      new Date(),
      false,
      params.sender,
      [],
      params.attachments,
      params.replyTo,
    );
  }

  get id(): string {
    return this._id;
  }

  get content(): string | null {
    return this._content;
  }

  get type(): MessageType {
    return this._type;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get isUpdated(): boolean {
    return this._isUpdated;
  }

  get sender(): MessageSender {
    return this._sender;
  }

  get reaction(): MessageReaction[] {
    return this._reactions;
  }

  get attachments(): MessageAttachment[] {
    return this._attachments;
  }

  get replyTo(): MessageReply | null | undefined {
    return this._replyTo;
  }
}
