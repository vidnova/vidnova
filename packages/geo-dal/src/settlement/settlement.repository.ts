import { ISettlementRepository } from './settlement-repository.interface';
import { GetSettlementsFilter } from '@vidnova/shared';
import { Settlement } from './settlement.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { FeatureCollection } from 'geojson';

@Injectable()
export class SettlementRepository implements ISettlementRepository {
  constructor(
    @InjectRepository(Settlement)
    private readonly repo: Repository<Settlement>,
  ) {}

  async findAll(
    filters: GetSettlementsFilter,
  ): Promise<{ settlements: Settlement[]; hasMore: boolean }> {
    const { page = 1, pageSize = 10 } = filters;

    const skip = (page - 1) * pageSize;
    const take = pageSize + 1;
    const order = this.buildFindAllOrder(filters);
    const where = this.buildFindAllWhere(filters);

    const settlements = await this.repo.find({
      skip,
      take,
      order,
      select: ['id', 'name', 'nameEn'],
      where,
    });
    const hasMore = settlements.length > (filters.pageSize ?? 10);

    return {
      settlements: settlements.slice(0, pageSize),
      hasMore,
    };
  }

  async findSettlementGeoJSON(settlementId: string): Promise<FeatureCollection | null> {
    const result = await this.repo.query(SettlementRepository.GET_SETTLEMENT_GEOJSON_SQL, [
      settlementId,
    ]);
    const geojson = result[0]?.geojson ?? null;

    if (!geojson?.features?.length) return null;

    return geojson;
  }

  private buildFindAllWhere(
    filters: GetSettlementsFilter,
  ): FindOptionsWhere<Settlement>[] | FindOptionsWhere<Settlement> {
    let where: FindOptionsWhere<Settlement>[] = [];

    const trimmedName = filters.name?.trim();
    if (trimmedName) {
      where.push({ name: ILike(`%${trimmedName}%`) }, { nameEn: ILike(`%${trimmedName}%`) });
    }

    if (where.length === 0) {
      where = [{}];
    }

    if (filters.region) {
      where = where.map((w) => ({ ...w, regionId: filters.region }));
    }

    return where;
  }

  private buildFindAllOrder(filters: GetSettlementsFilter) {
    return { name: filters.sortOrder ?? 'asc' };
  }

  private static GET_SETTLEMENT_GEOJSON_SQL = `
    SELECT json_build_object(
             'type', 'FeatureCollection',
             'features', json_agg(
               json_build_object(
                 'type', 'Feature',
                 'geometry', ST_AsGeoJSON(boundary)::json,
                 'properties', json_build_object(
                   'id', id,
                   'name', name,
                   'nameEn', "nameEn",
                   'areaKm2', "areaKm2"
                               )
               )
                         )
           ) as geojson
    FROM settlements
    WHERE id = $1;
  `;
}
