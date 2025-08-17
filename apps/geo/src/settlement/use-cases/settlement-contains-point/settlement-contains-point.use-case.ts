import { SettlementContainsPointCommand } from './settlement-contains-point.command';
import {
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import * as turf from '@turf/turf';
import { ISettlementRepository } from '@vidnova/geo-dal';

export class SettlementContainsPointUseCase {
  private logger = new Logger(SettlementContainsPointUseCase.name);

  constructor(
    @Inject('SETTLEMENT_REPOSITORY')
    private readonly settlementRepository: ISettlementRepository,
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
    const geojson =
      await this.settlementRepository.findSettlementGeoJSON(settlementId);

    if (!geojson) {
      throw new NotFoundException(
        `Settlement with ID ${settlementId} not found`,
      );
    }

    return geojson;
  }

  private isContainsPoint(
    geoJSON: FeatureCollection,
    lat: number,
    lon: number,
  ) {
    const point = turf.point([lon, lat]);
    const polygon = geoJSON.features[0] as Feature<Polygon | MultiPolygon>;

    return turf.booleanPointInPolygon(point, polygon);
  }
}
