import { ISettlementRepository } from './settlement-repository.interface';
import { Settlement } from './settlement.entity';
import { Region } from '../region';
import { PrismaService } from '../shared';
import { Injectable } from '@nestjs/common';
import { Pagination, SettlementFilters } from '@ecorally/shared';
import { Prisma } from '@prisma/client';

@Injectable()
export class SettlementRepository implements ISettlementRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string, options?: { includeRegion: boolean }): Promise<Settlement | null> {
    const settlement = await this.prismaService.settlement.findUnique({
      where: { id },
      include: { region: options && options.includeRegion },
    });

    if (!settlement) return null;

    let region: Region | undefined;
    if (options?.includeRegion && settlement.region) {
      region = Region.fromPersistence(settlement.region);
    }

    return Settlement.fromPersistence({ ...settlement, region });
  }

  async getAll(
    filters: SettlementFilters,
    pagination: Pagination,
  ): Promise<{ settlements: Settlement[]; total: number }> {
    const where = this.buildGetSettlementWhereClause(filters);
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const [settlements, total] = await Promise.all([
      this.prismaService.settlement.findMany({
        where,
        take: pageSize,
        skip,
      }),
      this.prismaService.settlement.count({ where }),
    ]);

    return {
      settlements: settlements.map((settlement) => Settlement.fromPersistence(settlement)),
      total,
    };
  }

  private buildGetSettlementWhereClause(filters: SettlementFilters): Prisma.SettlementWhereInput {
    const where: Prisma.SettlementWhereInput = {};

    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }

    if (filters.region) where.regionId = filters.region;

    return where;
  }
}
