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

export class GetRegionGeoJSONUseCase {
  private logger = new Logger(GetRegionGeoJSONUseCase.name);

  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async execute(command: GetRegionGeoJSONCommand) {
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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.regionRepository.query(query, [
        command.regionId,
      ]);

      const geojson = result?.[0]?.geojson;

      if (!geojson || !geojson.features || geojson.features.length === 0) {
        throw new NotFoundException(
          `Region with ID ${command.regionId} not found`,
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
      return result[0].geojson;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to get regions: ${error}`);
      throw new InternalServerErrorException('Failed to get regions');
    }
  }
}
