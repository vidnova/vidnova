import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

export interface UserRepository {
  create(data: CreateUserDto): Promise<User>;
  getByEmail(email: string): Promise<User | null>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
}
