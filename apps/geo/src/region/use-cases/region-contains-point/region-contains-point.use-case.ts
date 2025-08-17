import { RegionContainsPointCommand } from './region-contains-point.command';
import {
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as turf from '@turf/turf';
import { Feature, FeatureCollection, Polygon } from 'geojson';
import { IRegionRepository } from '@vidnova/geo-dal';

export class RegionContainsPointUseCase {
  private logger = new Logger(RegionContainsPointUseCase.name);

  constructor(
    @Inject('REGION_REPOSITORY')
    private readonly regionRepository: IRegionRepository,
  ) {}

  async execute(command: RegionContainsPointCommand) {
    try {
      const geojson = await this.parseGeoJSON(command.regionId);
      const isBelongs = this.isContainsPoint(geojson, command.lat, command.lon);

      return { isBelongs };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to check point: ${error}`);
      throw new InternalServerErrorException('Failed to check point');
    }
  }

  private async parseGeoJSON(regionId: string) {
    const geojson = await this.regionRepository.findRegionGeoJSON(regionId);

    if (!geojson) {
      throw new NotFoundException(`Region with ID ${regionId} not found`);
    }

    return geojson;
  }

  private isContainsPoint(
    geoJSON: FeatureCollection,
    lat: number,
    lon: number,
  ) {
    const point = turf.point([lon, lat]);
    const polygon = geoJSON.features[0] as Feature<Polygon>;

    return turf.booleanPointInPolygon(point, polygon);
  }
}
