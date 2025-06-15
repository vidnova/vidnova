import { PrismaService } from '../../../prisma/prisma.service';
import { UserRepository } from '../../domain/interfaces/user-repository.interface';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
    return User.fromPersistence(createdUser);
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? User.fromPersistence(user) : null;
  }

  async updatePassword(user: User): Promise<void> {
    await this.prisma.user.update({ where: { id: user.id }, data: { password: user.password } });
  }
}
