export class MessageReply {
  constructor(
    private readonly _id: string,
    private readonly _content: string | null,
  ) {}

  static fromPersistence(params: { id: string; content: string | null }): MessageReply {
    return new MessageReply(params.id, params.content);
  }

  toJSON() {
    return {
      id: this._id,
      content: this._content,
    };
  }
}
