import emojiRegex from 'emoji-regex';
import { v4 } from 'uuid';

export class MessageReaction {
  constructor(
    private readonly _id: string,
    private readonly _emoji: string,
    private readonly _userId: string,
    private readonly _messageId: string,
    private readonly _createdAt: Date,
  ) {}

  static create(params: { emoji: string; userId: string; messageId: string }): MessageReaction {
    const regex = emojiRegex();
    const matches = Array.from(params.emoji.matchAll(regex));

    if (matches.length !== 1 || matches[0][0] !== params.emoji) {
      throw new Error('You need to pass exactly one emoji');
    }

    return new MessageReaction(v4(), params.emoji, params.userId, params.messageId, new Date());
  }

  static fromPersistence(params: {
    id: string;
    emoji: string;
    userId: string;
    messageId: string;
    createdAt: Date;
  }): MessageReaction {
    return new MessageReaction(
      params.id,
      params.emoji,
      params.userId,
      params.messageId,
      params.createdAt,
    );
  }

  get id(): string {
    return this._id;
  }

  get emoji(): string {
    return this._emoji;
  }

  get userId(): string {
    return this._userId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get messageId(): string {
    return this._messageId;
  }

  toJSON() {
    return {
      id: this._id,
      emoji: this._emoji,
      user: this._userId,
      createdAt: this._createdAt,
    };
  }
}
