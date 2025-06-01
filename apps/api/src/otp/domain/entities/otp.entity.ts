export class Otp {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly code: string,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  getSnapshot() {
    return {
      id: this.id,
      userId: this.userId,
      code: this.code,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static create(params: {
    id: string;
    userId: string;
    code: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Otp {
    return new Otp(
      params.id,
      params.userId,
      params.code,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
    );
  }
}
