export class MessageReply {
  constructor(
    private readonly _id: string,
    private readonly _content: string | null,
  ) {}

  static create(params: { id: string }): MessageReply {
    return new MessageReply(params.id, '');
  }

  static fromPersistence(params: { id: string; content: string | null }): MessageReply {
    return new MessageReply(params.id, params.content);
  }

  get id(): string {
    return this._id;
  }

  get content(): string | null {
    return this._content;
  }

  toJSON() {
    return {
      id: this._id,
      content: this._content,
    };
  }
}
