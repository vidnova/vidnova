import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  createAccessToken,
  createRefreshToken,
  verifyToken,
} from '../../../common/utils/tokens.util';
import { JsonWebTokenError } from 'jsonwebtoken';
import { RefreshTokensCommand } from './refresh-token.command';
import { BlacklistedToken, IBlacklistedTokenRepository } from '@ecorally/dal';

@Injectable()
export class RefreshTokensUseCase {
  constructor(
    @Inject('BLACKLISTED_TOKEN_REPOSITORY')
    private readonly blacklistedTokenRepository: IBlacklistedTokenRepository,
  ) {}

  async execute(command: RefreshTokensCommand) {
    try {
      if (!command.refreshToken) {
        throw new UnauthorizedException('Refresh token is required');
      }

      const userId = this.verifyRefreshToken(command.refreshToken);
      await this.checkTokenBlacklist(command.refreshToken);
      await this.blacklistTokens(command, userId);

      return {
        accessToken: createAccessToken(userId),
        refreshToken: createRefreshToken(userId),
      };
    } catch (error: unknown) {
      if (error instanceof JsonWebTokenError) {
        throw new ForbiddenException('Invalid refresh token');
      }

      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to refresh tokens');
    }
  }

  private verifyRefreshToken(refreshToken: string): string {
    try {
      const payload = verifyToken(refreshToken);
      if (!payload) {
        throw new ForbiddenException('Invalid refresh token');
      }
      return payload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  private async checkTokenBlacklist(refreshToken: string): Promise<void> {
    const isBlacklisted = await this.blacklistedTokenRepository.getByToken(refreshToken);
    if (isBlacklisted) {
      throw new ForbiddenException('Refresh token is revoked');
    }
  }

  private async blacklistTokens(command: RefreshTokensCommand, userId: string): Promise<void> {
    const tokensToBlacklist: BlacklistedToken[] = [
      BlacklistedToken.create({ userId, token: command.refreshToken }),
    ];

    if (command.accessToken) {
      try {
        const payload = verifyToken(command.accessToken);
        if (payload === userId) {
          tokensToBlacklist.push(BlacklistedToken.create({ userId, token: command.accessToken }));
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: unknown) {
        new ForbiddenException('Invalid access token');
      }
    }

    if (tokensToBlacklist.length > 0) {
      await this.blacklistedTokenRepository.createMany(tokensToBlacklist);
    }
  }
}
