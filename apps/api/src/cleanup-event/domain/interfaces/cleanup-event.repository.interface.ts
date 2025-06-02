import { CleanupEvent } from '../entities/cleanup-event.entity';

export interface CleanupEventRepository {
  getById(id: string): Promise<CleanupEvent | null>;
}
