import { Region } from './region.entity';
import { GetRegionsFilter } from '@vidnova/shared';
import { FeatureCollection } from 'geojson';

export interface IRegionRepository {
  findAll(filters: GetRegionsFilter): Promise<{ regions: Region[]; hasMore: boolean }>;

  findRegionGeoJSON(regionId: string): Promise<FeatureCollection | null>;

  findRegionsGeoJSON(): Promise<FeatureCollection>;
}
