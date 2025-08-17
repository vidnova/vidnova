import { IRegionRepository } from './region-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from './region.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { GetRegionsFilter } from '@vidnova/shared';
import { FeatureCollection } from 'geojson';
import { Injectable } from '@nestjs/common';
import { Settlement } from '../settlement';

@Injectable()
export class RegionRepository implements IRegionRepository {
  constructor(
    @InjectRepository(Region)
    private readonly repo: Repository<Region>,
  ) {}

  async findAll(filters: GetRegionsFilter): Promise<{ regions: Region[]; hasMore: boolean }> {
    const { page = 1, pageSize = 10 } = filters;

    const skip = (page - 1) * pageSize;
    const take = pageSize + 1;
    const order = this.buildFindAllOrder(filters);
    const where = this.buildFindAllWhere(filters);

    const regions = await this.repo.find({
      skip,
      take,
      order,
      select: ['id', 'name', 'nameEn'],
      where,
    });

    const hasMore = regions.length > pageSize;

    return {
      regions: regions.slice(0, pageSize),
      hasMore,
    };
  }

  async findRegionGeoJSON(regionId: string): Promise<FeatureCollection | null> {
    return this.fetchGeoJSON(RegionRepository.GET_REGION_GEOJSON_SQL, [regionId]);
  }

  async findRegionsGeoJSON(): Promise<FeatureCollection> {
    return (
      (await this.fetchGeoJSON(RegionRepository.GET_REGIONS_GEOJSON_SQL)) ?? {
        type: 'FeatureCollection',
        features: [],
      }
    );
  }

  private buildFindAllWhere(
    filters: GetRegionsFilter,
  ): FindOptionsWhere<Settlement>[] | FindOptionsWhere<Settlement> {
    const trimmedName = filters.name?.trim();
    if (!trimmedName) return {};

    return [{ name: ILike(`%${trimmedName}%`) }, { nameEn: ILike(`%${trimmedName}%`) }];
  }

  private buildFindAllOrder(filters: GetRegionsFilter) {
    return { name: filters.sortOrder ?? 'asc' };
  }

  private async fetchGeoJSON(
    sql: string,
    params: unknown[] = [],
  ): Promise<FeatureCollection | null> {
    const result = await this.repo.query(sql, params);
    const geojson = result[0]?.geojson ?? null;

    if (!geojson?.features?.length) return null;

    return geojson;
  }

  private static readonly GET_REGION_GEOJSON_SQL = `
    SELECT json_build_object(
             'type', 'FeatureCollection',
             'features', json_agg(
               json_build_object(
                 'type', 'Feature',
                 'geometry', ST_AsGeoJSON(geometry)::json,
                 'properties', json_build_object(
                   'id', id,
                   'name', name,
                   'nameEn', "nameEn",
                   'areaKm2', "areaKm2"
                               )
               )
                         )
           ) AS geojson
    FROM regions
    WHERE id = $1
  `;

  private static readonly GET_REGIONS_GEOJSON_SQL = `
    SELECT json_build_object(
             'type', 'FeatureCollection',
             'features', json_agg(
               json_build_object(
                 'type', 'Feature',
                 'geometry', ST_AsGeoJSON(geometry)::json,
                 'properties', json_build_object(
                   'id', id,
                   'name', name,
                   'nameEn', "nameEn",
                   'areaKm2', "areaKm2"
                               )
               )
                         )
           ) AS geojson
    FROM regions
  `;
}
