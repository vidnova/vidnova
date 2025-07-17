import { TakePart } from './take-part.entity';

export interface ITakePartRepository {
  create(takePart: TakePart): Promise<TakePart>;
}
