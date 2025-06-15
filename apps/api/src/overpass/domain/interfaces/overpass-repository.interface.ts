import type { GeoJSON } from 'geojson';
import { Settlement } from '../../../domain/value-objects/settlement.vo';
import { Region } from '../../../domain/value-objects/region.vo';

export interface OverpassRepository {
  fetchSettlementBoundaries(settlement: Settlement, region: Region): Promise<GeoJSON>;

  fetchRegionBoundaries(region: Region): Promise<GeoJSON>;
}
