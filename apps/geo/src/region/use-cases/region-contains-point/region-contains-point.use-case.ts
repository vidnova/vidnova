import { Repository } from 'typeorm';
import { Region } from '../../entities/region.entity';
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
import { Feature, GeoJsonProperties, MultiPolygon, Polygon } from 'geojson';

export class RegionContainsPointUseCase {
  private logger = new Logger(RegionContainsPointUseCase.name);

  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async execute(command: RegionContainsPointCommand) {
    try {
      const query = `
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
               ) as geojson
        FROM regions
        WHERE id = $1;
      `;

      const result = await this.regionRepository.query<
        { geojson: GeoJSONCollection | null }[]
      >(query, [command.regionId]);

      const geojson = result?.[0]?.geojson;

      if (!geojson || !geojson.features || geojson.features.length === 0) {
        throw new NotFoundException(
          `Region with ID ${command.regionId} not found`,
        );
      }

      const point = turf.point([command.lon, command.lat]);
      const polygon = geojson.features[0] as Feature<
        Polygon | MultiPolygon,
        GeoJsonProperties
      >;

      const isBelongs = turf.booleanPointInPolygon(point, polygon);

      return { isBelongs };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to check point: ${error}`);
      throw new InternalServerErrorException('Failed to check point');
    }
  }
}
