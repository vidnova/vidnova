import { Injectable } from '@nestjs/common';
import { IBlacklistedTokenRepository } from './blacklisted-token-repository.interface';
import { PrismaService } from '../shared';
import { BlacklistedToken } from './blacklisted-token.entity';

@Injectable()
export class BlacklistedTokenRepository implements IBlacklistedTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByToken(token: string): Promise<BlacklistedToken | null> {
    const blacklistedToken = await this.prisma.blacklistToken.findUnique({ where: { token } });

    if (!blacklistedToken) return null;

    return BlacklistedToken.fromPersistence(blacklistedToken);
  }

  async createMany(blacklistedTokens: BlacklistedToken[]): Promise<void> {
    await this.prisma.blacklistToken.createMany({ data: blacklistedTokens });
  }
}
