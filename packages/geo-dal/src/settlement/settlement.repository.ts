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
    const trimmedName = filters.name?.trim();
    const where: FindOptionsWhere<Settlement>[] | object = trimmedName
      ? [{ name: ILike(`%${trimmedName}%`) }, { nameEn: ILike(`%${trimmedName}%`) }]
      : {};

    const skip = (filters.page - 1) * filters.pageSize;
    const take = filters.pageSize + 1;

    const settlements = await this.repo.find({
      skip,
      take,
      order: { ['name']: filters.sortOrder },
      select: ['id', 'name', 'nameEn'],
      where,
    });
    const hasMore = settlements.length > filters.pageSize;

    return { settlements, hasMore };
  }

  async findSettlementGeoJSON(settlementId: string): Promise<FeatureCollection | null> {
    const result = await this.repo.query(SettlementRepository.GET_SETTLEMENT_GEOJSON_SQL, [
      settlementId,
    ]);
    const geojson = result[0]?.geojson ?? null;

    if (!geojson?.features?.length) return null;

    return geojson;
  }

  private static GET_SETTLEMENT_GEOJSON_SQL = `
    SELECT json_build_object(
             'type', 'FeatureCollection',
             'features', json_agg(
               json_build_object(
                 'type', 'Feature',
                 'boundary', ST_AsGeoJSON(boundary)::json,
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
