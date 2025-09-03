import { MessageType } from '@vidnova/shared';
import { MessageSender } from './value-objects/message-sender.vo';
import { MessageReply } from './value-objects/message-reply.vo';
import { MessageReaction } from './value-objects/message-reaction.vo';
import { MessageAttachment } from './value-objects/message-attachment.vo';
import { v4 } from 'uuid';

export class Message {
  private readonly MAX_DAYS = 7 * 24 * 60 * 60 * 1000;

  constructor(
    private readonly _id: string,
    private readonly _content: string | null,
    private readonly _type: MessageType,
    private readonly _chatId: string,
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
    chatId: string;
    sender: MessageSender;
    attachments: MessageAttachment[];
    replyTo: MessageReply | null;
  }): Message {
    return new Message(
      v4(),
      params.content,
      params.type,
      params.chatId,
      new Date(),
      new Date(),
      false,
      params.sender,
      [],
      params.attachments,
      params.replyTo,
    );
  }

  static fromPersistence(params: {
    id: string;
    content: string | null;
    type: MessageType;
    chatId: string;
    createdAt: Date;
    updatedAt: Date;
    isUpdated: boolean;
    reactions: MessageReaction[];
    sender: MessageSender;
    attachments: MessageAttachment[];
    replyTo: MessageReply | null;
  }): Message {
    return new Message(
      params.id,
      params.content,
      params.type,
      params.chatId,
      params.createdAt,
      params.updatedAt,
      params.isUpdated,
      params.sender,
      params.reactions,
      params.attachments,
      params.replyTo,
    );
  }

  update(content: string): Message {
    if (Date.now() - this._createdAt.getTime() > this.MAX_DAYS) {
      throw new Error('Time to change message expired');
    }

    return new Message(
      this._id,
      content,
      this._type,
      this._chatId,
      this._createdAt,
      new Date(),
      true,
      this._sender,
      this._reactions,
      this._attachments,
      this._replyTo,
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

  get chatId(): string {
    return this._chatId;
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

  get reactions(): MessageReaction[] {
    return this._reactions;
  }

  get attachments(): MessageAttachment[] {
    return this._attachments;
  }

  get replyTo(): MessageReply | null | undefined {
    return this._replyTo;
  }

  toJSON() {
    return {
      id: this._id,
      content: this._content,
      type: this._type,
      chatId: this._chatId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      isUpdated: this._isUpdated,
      sender: this._sender,
      reactions: this._reactions,
      attachments: this._attachments,
      replyTo: this._replyTo,
    };
  }
}
