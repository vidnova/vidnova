import { MessageSender } from './message-sender.vo';

export class MessageReaction {
  constructor(
    private readonly _id: string,
    private readonly _emoji: string,
    private readonly _user: MessageSender,
    private readonly _createdAt: Date,
  ) {}

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
