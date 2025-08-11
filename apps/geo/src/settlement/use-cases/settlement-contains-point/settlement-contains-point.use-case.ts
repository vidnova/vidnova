import { Repository } from 'typeorm';
import { Settlement } from '../../entities/settlement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SettlementContainsPointCommand } from './settlement-contains-point.command';
import {
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GeoJSONCollection } from '../../../common/interfaces/geo-json-collection.interface';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import * as turf from '@turf/turf';

export class SettlementContainsPointUseCase {
  private logger = new Logger(SettlementContainsPointUseCase.name);

  constructor(
    @InjectRepository(Settlement)
    private readonly settlementRepository: Repository<Settlement>,
  ) {}

  async execute(command: SettlementContainsPointCommand) {
    try {
      const geojson = await this.parseGeoJSON(command.settlementId);
      const isBelongs = this.isContainsPoint(geojson, command.lat, command.lon);

      return { isBelongs };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to check point: ${error}`);
      throw new InternalServerErrorException('Failed to check point');
    }
  }

  private async parseGeoJSON(settlementId: string) {
    const result = await this.settlementRepository.query<
      { geojson: GeoJSONCollection | null }[]
    >(SettlementContainsPointUseCase.GET_SETTLEMENT_GEOJSON_SQL, [
      settlementId,
    ]);
    const geojson = result?.[0]?.geojson;

    if (!geojson?.features?.length) {
      throw new NotFoundException(
        `Settlement with ID ${settlementId} not found`,
      );
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

  private static readonly GET_SETTLEMENT_GEOJSON_SQL = `
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
