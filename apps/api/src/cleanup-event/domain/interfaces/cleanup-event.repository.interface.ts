import { UpsertCleanupEventDto } from '../dto/upsert-cleanup-event.dto';
import { CleanupEvent } from '../entities/cleanup-event.entity';

export interface CleanupEventRepository {
  getById(id: string): Promise<CleanupEvent | null>;
  create(data: UpsertCleanupEventDto, organizerId: string): Promise<CleanupEvent>;
}
