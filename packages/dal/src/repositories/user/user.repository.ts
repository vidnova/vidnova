import { IUserRepository } from './user-repository.interface';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared';
import { UserRole } from '@vidnova/shared';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prismaService.user.create({
      data: user.toPersistence(),
    });
    return User.fromPersistence({
      ...createdUser,
      lastname: createdUser.lastName,
      role: createdUser.role as UserRole,
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    return user
      ? User.fromPersistence({ ...user, lastname: user.lastName, role: user.role as UserRole })
      : null;
  }

  async updatePassword(user: User): Promise<void> {
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { password: user.password },
    });
  }

  async findFullById(userId: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } });

    if (!user) return null;

    return User.fromPersistence({
      ...user,
      lastname: user.lastName,
      role: user.role as UserRole,
    });
  }

  async findMany(usersIds: string[]): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: usersIds,
        },
      },
    });

    return users.map((user) =>
      User.fromPersistence({ ...user, lastname: user.lastName, role: user.role as UserRole }),
    );
  }
}
