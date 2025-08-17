import { InjectRepository } from '@nestjs/typeorm';
import { Settlement } from '../../../../../../packages/geo-dal/src/settlement/settlement.entity';
import { Repository } from 'typeorm';
import { GetSettlementGeoJSONCommand } from './get-settlement-geojson.command';
import {
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GeoJSONCollection } from '../../../common/interfaces/geo-json-collection.interface';

export class GetSettlementGeoJSONUseCase {
  private logger = new Logger(GetSettlementGeoJSONUseCase.name);

  constructor(
    @InjectRepository(Settlement)
    private readonly settlementRepository: Repository<Settlement>,
  ) {}

  async execute(command: GetSettlementGeoJSONCommand) {
    try {
      const result = await this.settlementRepository.query<
        { geojson: GeoJSONCollection | null }[]
      >(GetSettlementGeoJSONUseCase.GET_SETTLEMENT_GEOJSON_SQL, [
        command.settlementId,
      ]);

      const geojson = result?.[0]?.geojson;

      if (!geojson || !geojson.features || geojson.features.length === 0) {
        throw new NotFoundException(
          `Settlement with ID ${command.settlementId} not found`,
        );
      }

      return result[0].geojson;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to get regions: ${error}`);
      throw new InternalServerErrorException('Failed to get regions');
    }
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
