import { v4 } from 'uuid';

export class BlacklistedToken {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _token: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  static create(params: { userId: string; token: string }): BlacklistedToken {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return new BlacklistedToken(v4(), params.userId, params.token, new Date(), new Date());
  }

  static fromPersistence(params: {
    id: string;
    userId: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
  }): BlacklistedToken {
    return new BlacklistedToken(
      params.id,
      params.userId,
      params.token,
      params.createdAt,
      params.updatedAt,
    );
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get token(): string {
    return this._token;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
