import type { GeoJSON } from 'geojson';
import { Region } from '../../../region/domain/entities/region.entity';
import { Settlement } from '../../../settlement/domain/entities/settlement.entity';

export interface OverpassRepository {
  fetchSettlementBoundaries(settlement: Settlement, region: Region): Promise<GeoJSON>;
  fetchRegionBoundaries(region: Region): Promise<GeoJSON>;
}
