import type { GeoJSON } from 'geojson';
import { Settlement } from '../settlement';
import { Region } from '../region';

export interface IOverpassRepository {
  fetchSettlementBoundaries(settlement: Settlement, region: Region): Promise<GeoJSON>;

  fetchRegionBoundaries(region: Region): Promise<GeoJSON>;
}
