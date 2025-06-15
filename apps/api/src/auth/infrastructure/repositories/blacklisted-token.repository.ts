import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BlacklistedToken } from '../../domain/entities/blacklisted-token.entity';
import { BlacklistedTokenRepository } from '../../domain/interfaces/blacklisted-token-repository.interface';

@Injectable()
export class BlacklistedTokenRepositoryImpl implements BlacklistedTokenRepository {
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
