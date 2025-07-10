import { ContaminatedPoint } from './contaminated-point.entity';
import { ContaminatedPointDto } from './contaminated-point.dto';

export interface IContaminatedPointRepository {
  create(contaminatedPoint: ContaminatedPoint): Promise<ContaminatedPointDto>;
}
