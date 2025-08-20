import { Region } from './region.entity';
import { GetRegionsFilter } from '@vidnova/shared';
import { Feature, FeatureCollection } from 'geojson';

export interface IRegionRepository {
  findAll(filters: GetRegionsFilter): Promise<{ regions: Region[]; hasMore: boolean }>;

  findRegionGeoJSON(regionId: string): Promise<Feature | null>;

  findRegionsGeoJSON(): Promise<FeatureCollection>;
}
