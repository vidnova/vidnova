import { Settlement } from './settlement.entity';
import { Pagination, SettlementFilters } from '@vidnova/shared';

export interface ISettlementRepository {
  getById(settlementId: string, options?: { includeRegion: boolean }): Promise<Settlement | null>;

  getAll(
    filters?: SettlementFilters,
    pagination?: Pagination,
  ): Promise<{ settlements: Settlement[]; total: number }>;
}
