import { BlacklistedToken } from './blacklisted-token.entity';

export interface IBlacklistedTokenRepository {
  getByToken(token: string): Promise<BlacklistedToken | null>;

  createMany(blacklistedTokens: BlacklistedToken[]): Promise<void>;
}
