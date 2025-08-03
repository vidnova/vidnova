import { MessageSender } from './message-sender.vo';
import emojiRegex from 'emoji-regex';
import { v4 } from 'uuid';

export class MessageReaction {
  constructor(
    private readonly _id: string,
    private readonly _emoji: string,
    private readonly _user: MessageSender,
    private readonly _createdAt: Date,
  ) {}

  static create(params: { emoji: string; user: MessageSender }): MessageReaction {
    const regex = emojiRegex();
    const matches = Array.from(params.emoji.matchAll(regex));

    if (matches.length !== 1 || matches[0][0] !== params.emoji) {
      throw new Error('You need to pass exactly one emoji');
    }

    return new MessageReaction(v4(), params.emoji, params.user, new Date());
  }

  get id(): string {
    return this._id;
  }

  get emoji(): string {
    return this._emoji;
  }

  get user(): MessageSender {
    return this._user;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  toJSON() {
    return {
      id: this._id,
      emoji: this._emoji,
      user: this._user,
      createdAt: this._createdAt,
    };
  }
}
