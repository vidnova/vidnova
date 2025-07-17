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
import { CreateCleanupEventUseCase } from './use-cases/create-cleanup-event/create-cleanup-event.use-case';
import { GetCleanupEventUseCase } from './use-cases/get-cleanup-event/get-cleanup-event.use-case';
import { GetCleanupEventsUseCase } from './use-cases/get-cleanup-events/get-cleanup-events.use-case';
import { UpdateCleanupEventUseCase } from './use-cases/update-cleanup-event/update-cleanup-event.use-case';
import { DeleteCleanupEventUseCase } from './use-cases/delete-cleanup-event/delete-cleanup-event.use-case';
import { CreateCleanupEventCommand } from './use-cases/create-cleanup-event/create-cleanup-event.command';
import { GetCleanupEventCommand } from './use-cases/get-cleanup-event/get-cleanup-event.command';
import { GetCleanupEventsCommand } from './use-cases/get-cleanup-events/get-cleanup-events.command';
import { UpdateCleanupEventCommand } from './use-cases/update-cleanup-event/update-cleanup-event.command';
import { DeleteCleanupEventCommand } from './use-cases/delete-cleanup-event/delete-cleanup-event.command';
import { ICreateCleanupEventDto } from '@ecorally/shared';
import { CleanupEvent } from '@ecorally/dal';
import { GetCommentsByEventIdUseCase } from '../comment/use-cases/get-comments-by-event-id/get-comments-by-event-id.use-case';
import { GetCommentsByEventIdCommand } from '../comment/use-cases/get-comments-by-event-id/get-comments-by-event-id.command';
import { CreateTakePartUseCase } from '../take-part/use-cases/create-take-part/create-take-part.use-case';
import { CreateTakePartCommand } from '../take-part/use-cases/create-take-part/create-take-part.command';

@Controller('cleanup-events')
export class CleanupEventController {
  constructor(
    private readonly createCleanupEventUseCase: CreateCleanupEventUseCase,
    private readonly getCleanupEventUseCase: GetCleanupEventUseCase,
    private readonly getCleanupEventsUseCase: GetCleanupEventsUseCase,
    private readonly updateCleanupEventUseCase: UpdateCleanupEventUseCase,
    private readonly deleteCleanupEventUseCase: DeleteCleanupEventUseCase,
    private readonly getCommentsByEventIdUseCase: GetCommentsByEventIdUseCase,
    private readonly createTakePartUseCase: CreateTakePartUseCase,
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

  @Get(':cleanupEventId/comments')
  async getCleanupEventComments(@Param('cleanupEventId') cleanupEventId: string) {
    return this.getCommentsByEventIdUseCase.execute(
      GetCommentsByEventIdCommand.create({
        eventId: cleanupEventId,
      }),
    );
  }

  @Post(':cleanupEventId/take-part')
  @UseGuards(AuthGuard)
  async takePartInCleanupEvent(
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
