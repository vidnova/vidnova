export type GetContaminatedPointsFilters = {
  name?: string;
  status?: 'ACTIVE' | 'CLEANED';
  settlementId?: string;
  regionId?: string;
};
