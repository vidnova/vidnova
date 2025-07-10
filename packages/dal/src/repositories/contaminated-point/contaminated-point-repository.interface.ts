import { ContaminatedPoint } from './contaminated-point.entity';
import { ContaminatedPointDto } from './contaminated-point.dto';

export interface IContaminatedPointRepository {
  create(contaminatedPoint: ContaminatedPoint): Promise<ContaminatedPointDto>;

  getById(contaminatedPointId: string): Promise<ContaminatedPointDto | null>;

  update(contaminatedPoint: ContaminatedPoint): Promise<ContaminatedPointDto>;
}
