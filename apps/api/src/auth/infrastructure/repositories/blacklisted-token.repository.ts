import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BlacklistedToken } from '../../domain/entities/BlacklistedToken.entity';

@Injectable()
export class BlacklistedTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByToken(token: string): Promise<BlacklistedToken | null> {
    const blacklistedToken = await this.prisma.blacklistToken.findUnique({ where: { token } });

    if (!blacklistedToken) return null;

    return BlacklistedToken.create(blacklistedToken);
  }

  async createMany(tokens: { token: string; userId: string }[]): Promise<void> {
    await this.prisma.blacklistToken.createMany({ data: tokens });
  }
}
