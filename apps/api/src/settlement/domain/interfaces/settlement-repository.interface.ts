import { Settlement } from '../../../domain/value-objects/settlement.vo';

export interface SettlementRepository {
  getById(settlementId: string, options?: { includeRegion: boolean }): Promise<Settlement | null>;
}
