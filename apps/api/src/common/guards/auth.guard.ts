import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { FastifyRequest } from 'fastify';
import { PrismaService, User } from '@vidnova/dal';
import { AuthService, UserRole } from '@vidnova/shared';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = ctx.switchToHttp().getRequest();
    const accessToken: string | undefined = request.cookies.accessToken;

    if (!accessToken) {
      throw new UnauthorizedException('Access token not provided');
    }

    try {
      const id = this.authService.verifyToken(accessToken);
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      request.user = User.fromPersistence({
        ...user,
        lastname: user.lastName,
        role: user.role as UserRole,
      });
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Access token has expired');
      }

      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException('Access token is not valid');
      }

      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid authentication');
    }
  }
}
