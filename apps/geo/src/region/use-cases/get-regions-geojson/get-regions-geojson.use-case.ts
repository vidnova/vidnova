import { InjectRepository } from '@nestjs/typeorm';
import { Region } from '../../entities/region.entity';
import { Repository } from 'typeorm';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FindAllRegionsUseCase } from '../find-all-regions/find-all-regions.use-case';

@Injectable()
export class GetRegionsGeoJSONUseCase {
  private logger = new Logger(FindAllRegionsUseCase.name);

  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async execute() {
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
        FROM regions;
      `;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.regionRepository.query(query);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
      return result[0].geojson;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to get regions: ${error}`);
      throw new InternalServerErrorException('Failed to get regions');
    }
  }
}
