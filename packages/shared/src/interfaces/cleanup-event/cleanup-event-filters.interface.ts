import { CleanupEventStatus } from '../../types';
import { CleanupSortBy, CleanupSortOrder } from '../../enums';

export interface ICleanupEventsFilters {
  regionId?: string;
  settlementId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: CleanupEventStatus;
  name?: string;
  pageSize: number;
  page: number;
  sortBy?: CleanupSortBy;
  sortOrder?: CleanupSortOrder;
}
