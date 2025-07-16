export class CommentUser {
  constructor(
    private readonly _id: string,
    private readonly _imageUrl: string,
    private readonly _name: string,
  ) {}

  get id(): string {
    return this._id;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get name(): string {
    return this._name;
  }

  toJSON() {
    return {
      id: this._id,
      imageUrl: this._imageUrl,
      name: this.name,
    };
  }
}
