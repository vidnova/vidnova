import { BlacklistedToken } from '../entities/blacklisted-token.entity';

export interface BlacklistedTokenRepository {
  getByToken(token: string): Promise<BlacklistedToken | null>;

  createMany(blacklistedTokens: BlacklistedToken[]): Promise<void>;
}
