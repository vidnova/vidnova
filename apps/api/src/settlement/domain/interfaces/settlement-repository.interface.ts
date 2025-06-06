import { Settlement } from '../entities/settlement.entity';

export interface SettlementRepository {
  getById(settlementId: string, options?: { includeRegion: boolean }): Promise<Settlement | null>;
}
