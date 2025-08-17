import { GetSettlementsFilter } from '@vidnova/shared';
import { Settlement } from './settlement.entity';
import { FeatureCollection } from 'geojson';

export interface ISettlementRepository {
  findAll(filters: GetSettlementsFilter): Promise<{ settlements: Settlement[]; hasMore: boolean }>;

  findSettlementGeoJSON(settlementId: string): Promise<FeatureCollection | null>;
}
