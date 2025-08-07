import * as turf from '@turf/turf';
import { Feature, FeatureCollection, GeoJsonProperties, MultiPolygon, Polygon } from 'geojson';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IIsPointInRegion, IsPointInRegionCommand } from '@vidnova/shared';
import { OverpassRepository, RegionRepository } from '@vidnova/dal';

@Injectable()
export class IsPointInRegionUseCase implements IIsPointInRegion {
  constructor(
    @Inject('REGION_REPOSITORY')
    private readonly regionRepository: RegionRepository,
    @Inject('OVERPASS_REPOSITORY') private readonly overpassRepository: OverpassRepository,
  ) {}

  async execute(command: IsPointInRegionCommand): Promise<boolean> {
    const region = await this.regionRepository.getById(command.regionId);

    if (!region) {
      throw new NotFoundException(`Region with id ${command.regionId} not found.`);
    }

    const regionGeoJson = await this.overpassRepository.fetchRegionBoundaries(region);

    const point = turf.point([command.lon, command.lat]);

    const featureCollection = regionGeoJson as FeatureCollection;
    return turf.booleanPointInPolygon(
      point,
      featureCollection.features[0] as Feature<Polygon | MultiPolygon, GeoJsonProperties>,
    );
  }
}
