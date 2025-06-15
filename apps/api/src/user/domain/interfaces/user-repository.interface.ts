import { User } from '../entities/user.entity';

export interface UserRepository {
  create(data: User): Promise<User>;

  getByEmail(email: string): Promise<User | null>;

  updatePassword(user: User): Promise<void>;
}
