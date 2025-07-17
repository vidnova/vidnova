import { TakePart } from './take-part.entity';

export interface ITakePartRepository {
  create(takePart: TakePart): Promise<TakePart>;

  findByUserAndEventIds(eventId: string, userId: string): Promise<TakePart | null>;
}
