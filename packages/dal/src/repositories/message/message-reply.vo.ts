export class MessageReply {
  constructor(
    private readonly _id: string,
    private readonly _content: string,
  ) {}

  toJSON() {
    return {
      id: this._id,
      content: this._content,
    };
  }
}
