import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateTakePartUseCase } from './use-cases/create-take-part/create-take-part.use-case';
import { AuthGuard } from '../common/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { CreateTakePartCommand } from './use-cases/create-take-part/create-take-part.command';

@Controller('take-part')
export class TakePartController {
  constructor(private readonly createTakePartUseCase: CreateTakePartUseCase) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async create(
    @Param('cleanupEventId') cleanupEventId: string,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;

    return this.createTakePartUseCase.execute(
      CreateTakePartCommand.create({
        userId: user.id,
        eventId: cleanupEventId,
      }),
    );
  }
}
