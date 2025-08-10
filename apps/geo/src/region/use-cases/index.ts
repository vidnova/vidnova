import { FindAllRegionsUseCase } from './find-all-regions/find-all-regions.use-case';
import { GetRegionsGeoJSONUseCase } from './get-regions-geojson/get-regions-geojson.use-case';
import { GetRegionGeoJSONUseCase } from './get-region-geojson/get-region-geojson.use-case';
import { RegionContainsPointUseCase } from './region-contains-point/region-contains-point.use-case';

export const USE_CASES = [
  FindAllRegionsUseCase,
  GetRegionsGeoJSONUseCase,
  GetRegionGeoJSONUseCase,
  RegionContainsPointUseCase,
];
