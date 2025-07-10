import { CreateContaminatedPointUseCase } from './create-contaminated-point/create-contaminated-point.use-case';
import { GetContaminatedPointUseCase } from './get-contaminated-point/get-contaminated-point.use-case';
import { UpdateContaminatedPointUseCase } from './update-contaminated-point/update-contaminated-point.use-case';
import { GetContaminatedPointsUseCase } from './get-contaminated-points/get-contaminated-points.use-case';

export const USE_CASES = [
  CreateContaminatedPointUseCase,
  GetContaminatedPointUseCase,
  UpdateContaminatedPointUseCase,
  GetContaminatedPointsUseCase,
];
