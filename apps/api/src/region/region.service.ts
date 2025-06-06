import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OsmService } from '../overpass/overpass.service';
import { PrismaService } from '../prisma/prisma.service';
import * as turf from '@turf/turf';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from 'geojson';

@Injectable()
export class RegionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly osmService: OsmService,
  ) {}

  async isPointInRegion(
    lat: number,
    lon: number,
    regionId: string,
  ): Promise<boolean> {
    const region = await this.prisma.region.findUnique({
      where: { id: regionId },
    });

    if (!region) {
      throw new NotFoundException(`Region with id ${regionId} not found.`);
    }

    const cacheKey = `region:boundaries:${regionId}`;
    const geojson = await this.osmService.fetchRegionBoundaries(
      region,
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
