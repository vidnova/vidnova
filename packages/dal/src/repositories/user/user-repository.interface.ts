import { User } from './user.entity';

export interface IUserRepository {
  create(data: User): Promise<User>;

  getByEmail(email: string): Promise<User | null>;

  updatePassword(user: User): Promise<void>;

  getByGoogleId(googleID: string): Promise<User | null>;
}
