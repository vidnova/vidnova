import { User } from './user.entity';

export interface IUserRepository {
  create(data: User): Promise<User>;

  getByEmail(email: string): Promise<User | null>;

  updatePassword(user: User): Promise<void>;

  findFullById(userId: string): Promise<User | null>;

  findMany(userIds: string[]): Promise<User[]>;
}
