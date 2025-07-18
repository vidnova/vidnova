export type GetContaminatedPointsFilters = {
  name?: string;
  status?: 'ACTIVE' | 'CLEANED';
  settlement?: string;
  region?: string;
  user?: string;
};
