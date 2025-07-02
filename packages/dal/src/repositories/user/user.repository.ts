import { IUserRepository } from './user-repository.interface';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prismaService.user.create({
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
    const user = await this.prismaService.user.findUnique({ where: { email } });
    return user ? User.fromPersistence(user) : null;
  }

  async updatePassword(user: User): Promise<void> {
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { password: user.password },
    });
  }

  async getByGoogleId(googleId: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({ where: { googleId } });

    return user ? User.fromPersistence(user) : null;
  }
}
