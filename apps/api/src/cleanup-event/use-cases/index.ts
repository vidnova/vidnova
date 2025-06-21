import { CreateCleanupEventUseCase } from './create-cleanup-event/create-cleanup-event.use-case';
import { DeleteCleanupEventUseCase } from './delete-cleanup-event/delete-cleanup-event.use-case';
import { GetCleanupEventUseCase } from './get-cleanup-event/get-cleanup-event.use-case';
import { GetCleanupEventsUseCase } from './get-cleanup-events/get-cleanup-events.use-case';
import { UpdateCleanupEventUseCase } from './update-cleanup-event/update-cleanup-event.use-case';

export const USE_CASES = [
  CreateCleanupEventUseCase,
  DeleteCleanupEventUseCase,
  GetCleanupEventUseCase,
  GetCleanupEventsUseCase,
  UpdateCleanupEventUseCase,
];
