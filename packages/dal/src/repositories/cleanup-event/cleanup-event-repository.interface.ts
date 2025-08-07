import { CleanupEvent } from './cleanup-event.entity';
import { CleanupEventListDto } from '@vidnova/shared';

export interface ICleanupEventRepository {
  getById(id: string): Promise<CleanupEvent | null>;

  create(cleanupEvent: CleanupEvent): Promise<CleanupEvent>;

  update(cleanupEvent: CleanupEvent, cleanupEventId: string): Promise<CleanupEvent>;

  delete(cleanupEventId: string): Promise<void>;

  getAll(filters: any): Promise<{ cleanupEvents: CleanupEventListDto[]; total: number }>;
}
