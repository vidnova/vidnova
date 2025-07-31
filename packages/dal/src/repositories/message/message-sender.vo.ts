export class MessageSender {
  constructor(
    private readonly _id: string,
    private readonly _firstName: string,
    private readonly _lastName: string | null,
    private readonly _imageUrl: string,
  ) {}

  get id(): string {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string | null {
    return this._lastName;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  toJSON() {
    return {
      id: this._id,
      firstName: this._firstName,
      lastName: this._lastName,
      imageUrl: this._imageUrl,
    };
  }
}
