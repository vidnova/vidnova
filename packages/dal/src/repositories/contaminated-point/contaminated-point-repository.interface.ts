import { ContaminatedPoint } from './contaminated-point.entity';
import { ContaminatedPointDto, ContaminatedPointSummaryDto } from './contaminated-point.dto';
import { GetContaminatedPointsFilters, Pagination } from '@ecorally/shared';

export interface IContaminatedPointRepository {
  create(contaminatedPoint: ContaminatedPoint): Promise<ContaminatedPointDto>;

  getFullContentById(contaminatedPointId: string): Promise<ContaminatedPointDto | null>;

  update(contaminatedPoint: ContaminatedPoint): Promise<ContaminatedPointDto>;

  findById(id: string): Promise<ContaminatedPoint | null>;

  getAll(
    filters?: GetContaminatedPointsFilters,
    pagination?: Pagination,
  ): Promise<{ contaminatedPoints: ContaminatedPointSummaryDto[]; total: number }>;
}
