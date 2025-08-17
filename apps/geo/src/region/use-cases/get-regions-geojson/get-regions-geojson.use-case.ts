import { InjectRepository } from '@nestjs/typeorm';
import { Region } from '../../../../../../packages/geo-dal/src/region/region.entity';
import { Repository } from 'typeorm';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GeoJSONCollection } from '../../../common/interfaces/geo-json-collection.interface';

@Injectable()
export class GetRegionsGeoJSONUseCase {
  private logger = new Logger(GetRegionsGeoJSONUseCase.name);

  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async execute() {
    try {
      const [{ geojson }] = await this.regionRepository.query<
        { geojson: GeoJSONCollection | null }[]
      >(GetRegionsGeoJSONUseCase.GET_REGIONS_GEOJSON_SQL);
      return geojson;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to get regions: ${error}`);
      throw new InternalServerErrorException('Failed to get regions');
    }
  }

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
