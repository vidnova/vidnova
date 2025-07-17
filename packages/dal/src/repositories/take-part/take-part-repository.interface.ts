import { TakePart } from './take-part.entity';

export interface ITakePartRepository {
  create(takePart: TakePart): Promise<TakePart>;

  findByUserAndEventIds(eventId: string, userId: string): Promise<TakePart | null>;

  delete(takePartId: string): Promise<void>;

  findById(takePartId: string): Promise<TakePart | null>;
}
