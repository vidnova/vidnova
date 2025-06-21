import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as turf from '@turf/turf';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { IIsPointInsideSettlement, IsPointInSettlementCommand } from '@ecorally/shared';
import { IOverpassRepository, ISettlementRepository } from '@ecorally/dal';

@Injectable()
export class IsPointInsideSettlementUseCase implements IIsPointInsideSettlement {
  constructor(
    @Inject('SETTLEMENT_REPOSITORY') private readonly settlementRepository: ISettlementRepository,
    @Inject('OVERPASS_REPOSITORY') private readonly overpassRepository: IOverpassRepository,
  ) {}

  async execute(command: IsPointInSettlementCommand): Promise<boolean> {
    try {
      const settlement = await this.settlementRepository.getById(command.settlementId, {
        includeRegion: true,
      });

      if (!settlement) {
        throw new NotFoundException(`Settlement with id ${command.settlementId} not found.`);
      }

      const settlementGeojson = await this.overpassRepository.fetchSettlementBoundaries(
        settlement,
        settlement.region,
      );

      const point = turf.point([command.lon, command.lat]);

      const featureCollection = settlementGeojson as FeatureCollection;
      return turf.booleanPointInPolygon(
        point,
        featureCollection.features[0] as Feature<Polygon | MultiPolygon>,
      );
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        `Failed to check point: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      );
    }
  }
}
