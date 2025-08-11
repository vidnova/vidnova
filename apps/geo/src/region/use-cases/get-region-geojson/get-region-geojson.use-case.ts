import {
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from '../../entities/region.entity';
import { Repository } from 'typeorm';
import { GetRegionGeoJSONCommand } from './get-region-geojson.command';
import { GeoJSONCollection } from '../../../common/interfaces/geo-json-collection.interface';

export class GetRegionGeoJSONUseCase {
  private logger = new Logger(GetRegionGeoJSONUseCase.name);

  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async execute(command: GetRegionGeoJSONCommand) {
    try {
      const [{ geojson }] = await this.regionRepository.query<
        { geojson: GeoJSONCollection | null }[]
      >(GetRegionGeoJSONUseCase.GET_REGION_GEOJSON_SQL, [command.regionId]);

      if (!geojson?.features?.length) {
        throw new NotFoundException(
          `Region with ID ${command.regionId} not found`,
        );
      }

      return geojson;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to get regions: ${error}`);
      throw new InternalServerErrorException('Failed to get regions');
    }
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
