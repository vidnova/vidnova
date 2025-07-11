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
  UseGuards,
} from '@nestjs/common';
import { CreateContaminatedPointUseCase } from './use-cases/create-contaminated-point/create-contaminated-point.use-case';
import { AuthGuard } from '../common/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { CreateContaminatedPointDto } from './dtos/create-contaminated-point.dto';
import { CreateContaminatedPointCommand } from './use-cases/create-contaminated-point/create-contaminated-point.command';
import { GetContaminatedPointUseCase } from './use-cases/get-contaminated-point/get-contaminated-point.use-case';
import { GetContaminatedPointCommand } from './use-cases/get-contaminated-point/get-contaminated-point.command';
import { UpdateContaminatedPointDto } from './dtos/update-contaminated-point.dto';
import { UpdateContaminatedPointUseCase } from './use-cases/update-contaminated-point/update-contaminated-point.use-case';
import { UpdateContaminatedPointCommand } from './use-cases/update-contaminated-point/update-contaminated-point.command';
import { GetContaminatedPointsQueryDto } from './dtos/get-contaminated-points-query.dto';
import { GetContaminatedPointsUseCase } from './use-cases/get-contaminated-points/get-contaminated-points.use-case';
import { GetContaminatedPointsCommand } from './use-cases/get-contaminated-points/get-contaminated-points.command';
import { DeleteContaminatedPointUseCase } from './use-cases/delete-contaminated-point/delete-contaminated-point.use-case';
import { DeleteContaminatedPointCommand } from './use-cases/delete-contaminated-point/delete-contaminated-point.command';

@Controller('contaminated-points')
export class ContaminatedPointController {
  constructor(
    private readonly createContaminatedPointUseCase: CreateContaminatedPointUseCase,
    private readonly getContaminatedPointUseCase: GetContaminatedPointUseCase,
    private readonly updateContaminatedPointUseCase: UpdateContaminatedPointUseCase,
    private readonly getContaminatedPointsUseCase: GetContaminatedPointsUseCase,
    private readonly deleteContaminatedPointUseCase: DeleteContaminatedPointUseCase,
  ) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  async create(@Req() req: FastifyRequest, @Body() data: CreateContaminatedPointDto) {
    const user = req.user;

    return this.createContaminatedPointUseCase.execute(
      CreateContaminatedPointCommand.create({
        ...data,
        userId: user.id,
      }),
    );
  }

  @Get(':contaminatedPointId')
  async getById(@Param('contaminatedPointId') contaminatedPointId: string) {
    return this.getContaminatedPointUseCase.execute(
      GetContaminatedPointCommand.create({ contaminatedPointId }),
    );
  }

  @Put(':contaminatedPointId/update')
  @UseGuards(AuthGuard)
  async update(
    @Param('contaminatedPointId') contaminatedPointId: string,
    @Body() data: UpdateContaminatedPointDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;

    return this.updateContaminatedPointUseCase.execute(
      UpdateContaminatedPointCommand.create({
        ...data,
        userId: user.id,
        id: contaminatedPointId,
      }),
    );
  }

  @Get()
  async getAll(@Query() query: GetContaminatedPointsQueryDto) {
    return this.getContaminatedPointsUseCase.execute(
      GetContaminatedPointsCommand.create({ ...query }),
    );
  }

  @Delete(':contaminatedPointId/delete')
  @UseGuards(AuthGuard)
  async delete(
    @Param('contaminatedPointId') contaminatedPointId: string,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;

    const result = await this.deleteContaminatedPointUseCase.execute(
      DeleteContaminatedPointCommand.create({
        userId: user.id,
        contaminatedPointId,
      }),
    );

    return { message: result };
  }
}
