import { IContaminatedPointRepository } from './contaminated-point-repository.interface';
import { PrismaService } from '../shared';
import { ContaminatedPoint } from './contaminated-point.entity';
import { ContaminatedPointDto } from './contaminated-point.dto';
import { ContaminatedPointQueries } from './contaminated-point.query';
import { ContaminatedPointMapper } from './contaminated-point.mapper';
import { Injectable } from '@nestjs/common';
import { ContaminatedPointStatusEnum } from './contaminated-point-status.enum';

@Injectable()
export class ContaminatedPointRepository implements IContaminatedPointRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(contaminatedPoint: ContaminatedPoint): Promise<ContaminatedPointDto> {
    const createdContaminatedPoint = await this.prismaService.contaminatedPoint.create({
      data: {
        ...contaminatedPoint.toPrimitives(),
        location: { create: contaminatedPoint.location?.toPrimitives() },
      },
      select: ContaminatedPointQueries.SELECT_FIELDS,
    });

    return ContaminatedPointMapper.toFullContent(createdContaminatedPoint);
  }

  async getFullContentById(id: string): Promise<ContaminatedPointDto | null> {
    const contaminatedPoint = await this.prismaService.contaminatedPoint.findUnique({
      where: { id },
      select: ContaminatedPointQueries.SELECT_FIELDS,
    });

    return contaminatedPoint ? ContaminatedPointMapper.toFullContent(contaminatedPoint) : null;
  }

  async update(contaminatedPoint: ContaminatedPoint): Promise<ContaminatedPointDto> {
    const updatedContaminatedPoint = await this.prismaService.contaminatedPoint.update({
      where: { id: contaminatedPoint.id },
      data: {
        ...contaminatedPoint.toPrimitives(),
        location: { update: contaminatedPoint.location?.toPrimitives() },
      },
      select: ContaminatedPointQueries.SELECT_FIELDS,
    });

    return ContaminatedPointMapper.toFullContent(updatedContaminatedPoint);
  }

  async findById(id: string): Promise<ContaminatedPoint | null> {
    const contaminatedPoint = await this.prismaService.contaminatedPoint.findUnique({
      where: { id },
    });

    return contaminatedPoint
      ? ContaminatedPoint.fromPersistence({
          ...contaminatedPoint,
          status: contaminatedPoint.status as ContaminatedPointStatusEnum,
        })
      : null;
  }
}
