export class BlacklistedToken {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly token: string,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  getSnapshot() {
    return {
      id: this.id,
      userId: this.userId,
      token: this.token,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static create(params: {
    id: string;
    userId: string;
    token: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): BlacklistedToken {
    return new BlacklistedToken(
      params.id,
      params.userId,
      params.token,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
    );
  }
}
