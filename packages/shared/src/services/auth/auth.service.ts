import * as jwt from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface IPayload {
  id: string;
}

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtAccessExpiresIn: string;
  private readonly jwtRefreshExpiresIn: string;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '1h';
    this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '10d';
  }

  createToken(userId: string, tokenType: 'access' | 'refresh') {
    return jwt.sign({ id: userId }, this.jwtSecret, {
      expiresIn: tokenType === 'access' ? this.jwtAccessExpiresIn : this.jwtRefreshExpiresIn,
    } as jwt.SignOptions);
  }

  verifyToken(token: string) {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as IPayload;
      return payload.id;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
