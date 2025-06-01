import { PrismaService } from '../../../prisma/prisma.service';
import { UserRepository } from '../../domain/interfaces/user-repository.interface';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../domain/dto/create-user.dto';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({ data: { ...data } });
    return User.create(user);
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? User.create(user) : null;
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
  }
}
