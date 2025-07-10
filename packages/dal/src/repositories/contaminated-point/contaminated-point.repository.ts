import { IContaminatedPointRepository } from './contaminated-point-repository.interface';
import { PrismaService } from '../shared';
import { ContaminatedPoint } from './contaminated-point.entity';
import { ContaminatedPointDto } from './contaminated-point.dto';
import { ContaminatedPointQueries } from './contaminated-point.query';
import { ContaminatedPointMapper } from './contaminated-point.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContaminatedPointRepository implements IContaminatedPointRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(contaminatedPoint: ContaminatedPoint): Promise<ContaminatedPointDto> {
    const createdContaminatedPoint = await this.prismaService.contaminatedPoint.create({
      data: {
        ...contaminatedPoint.toPrimitives(),
        location: { create: contaminatedPoint.location.toPrimitives() },
      },
      select: ContaminatedPointQueries.SELECT_FIELDS,
    });

    return ContaminatedPointMapper.toFullContent(createdContaminatedPoint);
  }

  async getById(id: string): Promise<ContaminatedPointDto | null> {
    const contaminatedPoint = await this.prismaService.contaminatedPoint.findUnique({
      where: { id },
      select: ContaminatedPointQueries.SELECT_FIELDS,
    });

    return contaminatedPoint ? ContaminatedPointMapper.toFullContent(contaminatedPoint) : null;
  }
}
