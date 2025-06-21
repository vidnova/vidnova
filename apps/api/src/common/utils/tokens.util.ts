import * as jwt from 'jsonwebtoken';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;

interface IPayload {
  id: string;
}

export const createAccessToken = (id: string): string => {
  try {
    return jwt.sign({ id }, jwtSecret, {
      expiresIn: jwtAccessExpiresIn,
    } as jwt.SignOptions);
  } catch {
    throw new InternalServerErrorException('Internal server error');
  }
};

export const createRefreshToken = (id: string): string => {
  try {
    return jwt.sign({ id }, jwtSecret, {
      expiresIn: jwtRefreshExpiresIn,
    } as jwt.SignOptions);
  } catch {
    throw new InternalServerErrorException('Internal server error');
  }
};

export const verifyToken = (token: string): string => {
  try {
    const payload = jwt.verify(token, jwtSecret) as IPayload;
    return payload.id;
  } catch {
    throw new UnauthorizedException('Invalid token');
  }
};
