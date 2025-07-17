import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateTakePartUseCase } from './use-cases/create-take-part/create-take-part.use-case';
import { AuthGuard } from '../common/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { CreateTakePartCommand } from './use-cases/create-take-part/create-take-part.command';
import { CreateTakePartDto } from './dtos/create-take-part.dto';
import { DeleteTakePartUseCase } from './use-cases/delete-take-part/delete-take-part.use-case';
import { DeleteTakePartCommand } from './use-cases/delete-take-part/delete-take-part.command';

@Controller('take-part')
export class TakePartController {
  constructor(
    private readonly createTakePartUseCase: CreateTakePartUseCase,
    private readonly deleteTakePartUseCase: DeleteTakePartUseCase,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateTakePartDto, @Req() req: FastifyRequest) {
    const user = req.user;

    return this.createTakePartUseCase.execute(
      CreateTakePartCommand.create({
        userId: user.id,
        eventId: data.cleanupEventId,
      }),
    );
  }

  @Delete(':takePartId')
  @UseGuards(AuthGuard)
  async delete(@Param('takePartId') takePartId: string, @Req() req: FastifyRequest) {
    const user = req.user;

    return this.deleteTakePartUseCase.execute(
      DeleteTakePartCommand.create({
        takePartId,
        userId: user.id,
      }),
    );
  }
}
