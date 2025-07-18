import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateReportUseCase } from './use-cases/create-report/create-report.use-case';
import { AuthGuard } from '../common/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { CreateReportDto } from './dtos/create-report.dto';
import { CreateReportCommand } from './use-cases/create-report/create-report.command';

@Controller('reports')
export class ReportController {
  constructor(private readonly createReportUseCase: CreateReportUseCase) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Req() req: FastifyRequest, @Body() data: CreateReportDto) {
    const user = req.user;

    return this.createReportUseCase.execute(
      CreateReportCommand.create({ ...data, userId: user.id }),
    );
  }
}
