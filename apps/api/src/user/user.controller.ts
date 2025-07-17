import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { GetUserFullInfoUseCase } from './use-cases/get-user-full-info/get-user-full-info.use-case';
import { GetUserFullInfoCommand } from './use-cases/get-user-full-info/get-user-full-info.command';
import { AuthGuard } from '../common/guards/auth.guard';
import { FastifyRequest } from 'fastify';

@Controller('users')
export class UserController {
  constructor(private readonly getUserFullInfoUseCase: GetUserFullInfoUseCase) {}

  @Get(':userId')
  async getUserFullInfo(@Param('userId') userId: string) {
    return this.getUserFullInfoUseCase.execute(GetUserFullInfoCommand.create({ userId }));
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() req: FastifyRequest) {
    return req.user;
  }
}
