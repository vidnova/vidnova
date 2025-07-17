import { v4 } from 'uuid';
import { UserRole } from '@ecorally/shared';

export class User {
  constructor(
    private readonly _id: string,
    private readonly _username: string,
    private readonly _firstName: string,
    private readonly _lastName: string | null,
    private readonly _email: string,
    private readonly _isVerified: boolean,
    private readonly _role: UserRole,
    private readonly _imageUrl: string,
    private readonly _createdAt: Date,
    private readonly _password: string | null,
  ) {}

  static create(params: {
    email: string;
    imageUrl?: string;
    password?: string;
    isVerified?: boolean;
  }): User {
    const name = params.email.split('@')[0];

    if (params.imageUrl && !this.isValidUrl(params.imageUrl)) {
      throw new Error('Invalid image URL');
    }

    return new User(
      v4(),
      name,
      name,
      null,
      params.email,
      params.isVerified ?? false,
      UserRole.USER,
      params.imageUrl ?? '',
      new Date(),
      params.password ?? null,
    );
  }

  static fromPersistence(params: {
    id: string;
    username: string;
    firstName: string;
    lastname: string | null;
    email: string;
    isVerified: boolean;
    role: UserRole;
    imageUrl: string;
    createdAt: Date;
    password: string | null;
  }): User {
    return new User(
      params.id,
      params.username,
      params.firstName,
      params.lastname,
      params.email,
      params.isVerified,
      params.role,
      params.imageUrl,
      params.createdAt,
      params.password,
    );
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  updatePassword(newPassword: string): User {
    return new User(
      this._id,
      this._username,
      this._firstName,
      this._lastName,
      this._email,
      this._isVerified,
      this._role,
      this._imageUrl,
      this._createdAt,
      newPassword,
    );
  }

  get id(): string {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string | null {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }

  get isVerified(): boolean {
    return this._isVerified;
  }

  get role(): UserRole {
    return this._role;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get password(): string | null | undefined {
    return this._password;
  }

  toJSON() {
    return {
      id: this._id,
      username: this._username,
      firstName: this._firstName,
      lastName: this._lastName,
      isVerified: this._isVerified,
      role: this._role,
      imageUrl: this._imageUrl,
      createdAt: this._createdAt,
    };
  }
}
