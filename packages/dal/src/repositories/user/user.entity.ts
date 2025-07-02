import { v4 } from 'uuid';

export class User {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _email: string,
    private readonly _isVerified: boolean,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _password: string | null,
    private readonly _googleId: string | null,
  ) {}

  static create(params: { email: string; password?: string; googleId?: string }): User {
    const name = params.email.split('@')[0];
    return new User(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      v4(),
      name,
      params.email,
      false,
      new Date(),
      new Date(),
      params.password ?? null,
      params.googleId ?? null,
    );
  }

  static fromPersistence(params: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    password: string | null;
    googleId: string | null;
  }): User {
    return new User(
      params.id,
      params.name,
      params.email,
      params.isVerified,
      params.createdAt,
      params.updatedAt,
      params.password,
      params.googleId,
    );
  }

  updatePassword(newPassword: string): User {
    return new User(
      this._id,
      this._name,
      this._email,
      this._isVerified,
      this._createdAt,
      new Date(),
      newPassword,
      this._googleId
    );
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get isVerified(): boolean {
    return this._isVerified;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get password(): string | null | undefined {
    return this._password;
  }

  get googleId(): string | null | undefined {
    return this._googleId;
  }
}
