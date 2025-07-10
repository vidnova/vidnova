import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateContaminatedPointUseCase } from './use-cases/create-contaminated-point/create-contaminated-point.use-case';
import { AuthGuard } from '../common/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { CreateContaminatedPointDto } from './dtos/create-contaminated-point.dto';
import { CreateContaminatedPointCommand } from './use-cases/create-contaminated-point/create-contaminated-point.command';

@Controller('contaminated-points')
export class ContaminatedPointController {
  constructor(private readonly createContaminatedPointUseCase: CreateContaminatedPointUseCase) {}

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
}
