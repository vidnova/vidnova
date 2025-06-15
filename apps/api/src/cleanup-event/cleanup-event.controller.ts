import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateCleanupEventDto } from './dtos/upsert-cleanup-event.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from '../common/guards/auth.guard';
import { GetCleanupEventsQueryDto } from './dtos/get-cleanup-events-query';
import { CreateCleanupEventUseCase } from './application/use-cases/create-cleanup-event.use-case';
import { GetCleanupEventUseCase } from './application/use-cases/get-cleanup-event.use-case';
import { GetCleanupEventsUseCase } from './application/use-cases/get-cleanup-events.use-case';
import { UpdateCleanupEventUseCase } from './application/use-cases/update-cleanup-event.use-case';
import { DeleteCleanupEventUseCase } from './application/use-cases/delete-cleanup-event.use-case';
import { CreateCleanupEventCommand } from './application/commands/create-cleanup-event.command';
import { CleanupEvent } from './domain/entities/cleanup-event.entity';
import { GetCleanupEventCommand } from './application/commands/get-cleanup-event.command';
import { GetCleanupEventsCommand } from './application/commands/get-cleanup-events.command';
import { UpdateCleanupEventCommand } from './application/commands/update-cleanup-event.command';
import { DeleteCleanupEventCommand } from './application/commands/delete-cleanup-event.command';
import { ICreateCleanupEventDto } from '@ecorally/shared';

@Controller('cleanup-events')
export class CleanupEventController {
  constructor(
    private readonly createCleanupEventUseCase: CreateCleanupEventUseCase,
    private readonly getCleanupEventUseCase: GetCleanupEventUseCase,
    private readonly getCleanupEventsUseCase: GetCleanupEventsUseCase,
    private readonly updateCleanupEventUseCase: UpdateCleanupEventUseCase,
    private readonly deleteCleanupEventUseCase: DeleteCleanupEventUseCase,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async createCleanupEvent(
    @Req() req: FastifyRequest,
    @Body() data: CreateCleanupEventDto,
  ): Promise<CleanupEvent> {
    const user = req.user;

    return this.createCleanupEventUseCase.execute(
      CreateCleanupEventCommand.create({
        ...data,
        userId: user.id,
      }),
    );
  }

  @Get(':cleanupEventId')
  async getCleanupEventById(@Param('cleanupEventId') cleanupEventId: string) {
    return this.getCleanupEventUseCase.execute(GetCleanupEventCommand.create({ cleanupEventId }));
  }

  @Get()
  async getCleanupEvents(@Query() query: GetCleanupEventsQueryDto) {
    return this.getCleanupEventsUseCase.execute(GetCleanupEventsCommand.create({ ...query }));
  }

  @Put(':cleanupEventId/update')
  @UseGuards(AuthGuard)
  async updateCleanupEvent(
    @Param('cleanupEventId') cleanupEventId: string,
    @Body() data: ICreateCleanupEventDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    return this.updateCleanupEventUseCase.execute(
      UpdateCleanupEventCommand.create({
        ...data,
        userId: user.id,
        cleanupEventId,
      }),
    );
  }

  @Delete(':cleanupEventId/delete')
  @UseGuards(AuthGuard)
  async deleteCleanupEvent(
    @Param('cleanupEventId') cleanupEventId: string,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    const user = req.user;
    const deleteCleanupEventResult = await this.deleteCleanupEventUseCase.execute(
      DeleteCleanupEventCommand.create({
        cleanupEventId,
        userId: user.id,
      }),
    );

    return res.send({ message: deleteCleanupEventResult });
  }
}
