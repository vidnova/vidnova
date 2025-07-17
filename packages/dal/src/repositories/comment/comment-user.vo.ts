export class CommentUser {
  constructor(
    private readonly _id: string,
    private readonly _imageUrl: string,
    private readonly _firstName: string,
    private readonly _lastName: string | null,
  ) {}

  static fromPersistence(params: {
    id: string;
    firstName: string;
    lastName: string | null;
    imageUrl: string;
  }): CommentUser {
    return new CommentUser(params.id, params.imageUrl, params.firstName, params.lastName);
  }

  get id(): string {
    return this._id;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string | null {
    return this._lastName;
  }

  toJSON() {
    return {
      id: this._id,
      imageUrl: this._imageUrl,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
}
