import { v4 } from 'uuid';

export class Otp {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _code: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  static fromPersistence(params: {
    id: string;
    userId: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
  }): Otp {
    return new Otp(params.id, params.userId, params.code, params.createdAt, params.updatedAt);
  }

  static create(params: { userId: string; code: string }): Otp {
    return new Otp(v4(), params.userId, params.code, new Date(), new Date());
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get code(): string {
    return this._code;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
