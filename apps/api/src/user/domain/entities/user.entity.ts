export class User {
  constructor(
    private readonly id: string,
    private name: string,
    private password: string,
    private email: string,
    private isVerified: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(params: {
    id: string;
    name: string;
    password: string;
    email: string;
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    return new User(
      params.id,
      params.name,
      params.password,
      params.email,
      params.isVerified ?? false,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
    );
  }

  getPassword(): string {
    return this.password;
  }

  getSnapshot() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      isVerified: this.isVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
