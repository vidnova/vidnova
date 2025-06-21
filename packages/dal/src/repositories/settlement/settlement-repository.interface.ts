import { Settlement } from './settlement.entity';

export interface ISettlementRepository {
  getById(settlementId: string, options?: { includeRegion: boolean }): Promise<Settlement | null>;
}
