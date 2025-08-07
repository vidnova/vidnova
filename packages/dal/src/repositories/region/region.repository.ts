import { IRegionRepository } from './region-repository.interface';
import { Region } from './region.entity';
import { PrismaService } from '../shared';
import { Injectable } from '@nestjs/common';
import { Pagination, RegionFilters } from '@vidnova/shared';
import { Prisma } from '@prisma/client';

@Injectable()
export class RegionRepository implements IRegionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string): Promise<Region | null> {
    const region = await this.prismaService.region.findUnique({ where: { id } });

    if (!region) return null;

    return Region.fromPersistence(region);
  }

  async getAll(
    filters: RegionFilters,
    pagination: Pagination,
  ): Promise<{ regions: Region[]; total: number }> {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const where = this.buildGetRegionsWhereClause(filters);

    const [regions, total] = await Promise.all([
      this.prismaService.region.findMany({
        where,
        take: pageSize,
        skip,
      }),
      this.prismaService.region.count({ where }),
    ]);

    return {
      regions: regions.map((region) => Region.fromPersistence(region)),
      total,
    };
  }

  private buildGetRegionsWhereClause(filters: RegionFilters): Prisma.RegionWhereInput {
    const where: Prisma.RegionWhereInput = {};

    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }

    return where;
  }
}
