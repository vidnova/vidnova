import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ContaminatedPointService } from './contaminated-point.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UpsertContaminatedPointDto } from './dto/upsert-contaminated-point.dto';
import { User } from '@prisma/client';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('contaminated-points')
export class ContaminatedPointController {
  constructor(
    private readonly contaminatedPointService: ContaminatedPointService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async createContaminatedPoint(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Body() data: UpsertContaminatedPointDto,
  ) {
    const user = req.user as User;
    const contaminatedPoint =
      await this.contaminatedPointService.createContaminatedPoint(
        data,
        user.id,
      );

    return res.send(contaminatedPoint);
  }

  @Get(':contaminatedPointId')
  async getContaminatedPoint(
    @Param('contaminatedPointId') contaminatedPointId: string,
    @Res() res: FastifyReply,
  ) {
    const contaminatedPoint =
      await this.contaminatedPointService.getContaminatedPoint(
        contaminatedPointId,
      );

    return res.send(contaminatedPoint);
  }
}
