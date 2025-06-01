import {
  ForbiddenException,
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
import { BlacklistedTokenRepository } from '../../../auth/infrastructure/repositories/blacklisted-token.repository';

@Injectable()
export class RefreshTokensUseCase {
  constructor(private readonly blacklistedTokenRepository: BlacklistedTokenRepository) {}

  async execute(accessToken?: string, refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const userId = verifyToken(refreshToken);
      if (!userId) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const isBlacklisted = await this.blacklistedTokenRepository.getByToken(refreshToken);

      if (isBlacklisted) {
        throw new ForbiddenException('Refresh token is revoked');
      }

      const blacklistData: { token: string; userId: string }[] = [{ token: refreshToken, userId }];

      if (accessToken) {
        try {
          const accessTokenUserId = verifyToken(accessToken);
          if (accessTokenUserId && accessTokenUserId === userId) {
            blacklistData.push({ token: accessToken, userId });
          }
        } catch (error) {
          if (!(error instanceof JsonWebTokenError)) {
            throw error;
          }
        }
      }

      await this.blacklistedTokenRepository.createMany(blacklistData);

      const newAccessToken = createAccessToken(userId);
      const newRefreshToken = createRefreshToken(userId);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error: unknown) {
      if (error instanceof JsonWebTokenError) {
        throw new ForbiddenException('Invalid refresh token');
      }

      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Failed to refresh tokens: ${error instanceof Error ? error.message : error}`,
      );
    }
  }
}
