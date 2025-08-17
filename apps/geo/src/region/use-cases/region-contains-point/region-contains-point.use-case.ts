import { Repository } from 'typeorm';
import { Region } from '../../../../../../packages/geo-dal/src/region/region.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionContainsPointCommand } from './region-contains-point.command';
import {
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as turf from '@turf/turf';
import { GeoJSONCollection } from '../../../common/interfaces/geo-json-collection.interface';
import { Feature, Polygon } from 'geojson';

export class RegionContainsPointUseCase {
  private logger = new Logger(RegionContainsPointUseCase.name);

  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async execute(command: RegionContainsPointCommand) {
    try {
      const geojson = await this.parseGeoJSON(command.regionId);
      const isBelongs = this.isContainsPoint(geojson, command.lat, command.lon);

      return { isBelongs };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to check point: ${error}`);
      throw new InternalServerErrorException('Failed to check point');
    }
  }

  private async parseGeoJSON(regionId: string) {
    const result = await this.regionRepository.query<
      { geojson: GeoJSONCollection | null }[]
    >(RegionContainsPointUseCase.GET_REGION_GEOJSON_SQL, [regionId]);
    const geojson = result?.[0]?.geojson;

    if (!geojson?.features?.length) {
      throw new NotFoundException(`Region with ID ${regionId} not found`);
    }

    return geojson;
  }

  private isContainsPoint(
    geoJSON: GeoJSONCollection,
    lat: number,
    lon: number,
  ) {
    const point = turf.point([lon, lat]);
    const polygon = geoJSON.features[0] as Feature<Polygon>;

    return turf.booleanPointInPolygon(point, polygon);
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
}
