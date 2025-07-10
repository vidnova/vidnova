import { ContaminatedPointStatusEnum } from '@ecorally/dal';

export type GetContaminatedPointsFilters = {
  name?: string;
  status?: ContaminatedPointStatusEnum;
  settlementId?: string;
  regionId?: string;
};
