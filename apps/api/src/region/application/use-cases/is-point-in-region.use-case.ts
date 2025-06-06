import { RegionRepository } from '../../domain/interfaces/region.repository.interface';
import { IsPointInRegion } from '../../domain/interfaces/is-point-in-region.use-case.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OverpassRepository } from '../../../overpass/domain/interfaces/overpass-repository.interface';
import * as turf from '@turf/turf';
import { Feature, FeatureCollection, GeoJsonProperties, MultiPolygon, Polygon } from 'geojson';

@Injectable()
export class IsPointInRegionUseCase implements IsPointInRegion {
  constructor(
    private readonly regionRepository: RegionRepository,
    @Inject('OVERPASS_REPOSITORY') private readonly overpassRepository: OverpassRepository,
  ) {}

  async execute(regionId: string, lon: number, lat: number): Promise<boolean> {
    const region = await this.regionRepository.getById(regionId);

    if (!region) {
      throw new NotFoundException(`Region with id ${regionId} not found.`);
    }

    const regionGeoJson = await this.overpassRepository.fetchRegionBoundaries(region);

    const point = turf.point([lon, lat]);

    const featureCollection = regionGeoJson as FeatureCollection;
    return turf.booleanPointInPolygon(
      point,
      featureCollection.features[0] as Feature<Polygon | MultiPolygon, GeoJsonProperties>,
    );
  }
}
