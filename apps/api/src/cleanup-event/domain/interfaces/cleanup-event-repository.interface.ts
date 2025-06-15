import { CleanupEvent } from '../entities/cleanup-event.entity';
import { EventListDto } from '../../application/dtos/event-list.dto';
import { GetCleanupEventsCommand } from '../../application/commands/get-cleanup-events.command';

export interface CleanupEventRepository {
  getById(id: string): Promise<CleanupEvent | null>;

  create(cleanupEvent: CleanupEvent): Promise<CleanupEvent>;

  update(cleanupEvent: CleanupEvent, cleanupEventId: string): Promise<CleanupEvent>;

  delete(cleanupEventId: string): Promise<void>;

  getAll(
    filters: GetCleanupEventsCommand,
  ): Promise<{ cleanupEvents: EventListDto[]; total: number }>;
}
