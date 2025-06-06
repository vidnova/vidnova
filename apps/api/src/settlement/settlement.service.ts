import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as turf from '@turf/turf';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { OsmService } from '../overpass/overpass.service';

@Injectable()
export class SettlementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly osmService: OsmService,
  ) {}

  async isPointInSettlement(
    lat: number,
    lon: number,
    settlementId: string,
  ): Promise<boolean> {
    const settlement = await this.prisma.settlement.findUnique({
      where: { id: settlementId },
      include: {
        region: true,
      },
    });

    if (!settlement) {
      throw new NotFoundException(
        `Settlement with id ${settlementId} not found.`,
      );
    }

    const cacheKey = `settlement:boundaries:${settlementId}`;
    const geojson = await this.osmService.fetchSettlementBoundaries(
      settlement,
      settlement.region,
      cacheKey,
    );

    if (!geojson) {
      throw new InternalServerErrorException(
        'No valid boundaries found for settlement',
      );
    }

    const point = turf.point([lon, lat]);

    const featureCollection = geojson as FeatureCollection;
    return turf.booleanPointInPolygon(
      point,
      featureCollection.features[0] as Feature<
        Polygon | MultiPolygon,
        GeoJsonProperties
      >,
    );
  }
}
