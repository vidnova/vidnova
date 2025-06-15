import { v4 } from 'uuid';

export class User {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _password: string,
    private readonly _email: string,
    private readonly _isVerified: boolean,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  static create(params: { password: string; email: string }): User {
    const name = params.email.split('@')[0];
    return new User(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      v4(),
      name,
      params.password,
      params.email,
      false,
      new Date(),
      new Date(),
    );
  }

  static fromPersistence(params: {
    id: string;
    name: string;
    password: string;
    email: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      params.id,
      params.name,
      params.password,
      params.email,
      params.isVerified,
      params.createdAt,
      params.updatedAt,
    );
  }

  updatePassword(newPassword: string): User {
    return new User(
      this._id,
      this._name,
      newPassword,
      this._email,
      this._isVerified,
      this._createdAt,
      new Date(), // обновляем updatedAt
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

  get password(): string {
    return this._password;
  }
}
