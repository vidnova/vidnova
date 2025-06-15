import { SortBy, SortOrder } from '../../enums';
import { CleanupEventStatus } from '../../types';
export interface IGetCleanupEventQueryDto {
    regionId?: string;
    settlementId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: CleanupEventStatus;
    name?: string;
    pageSize: number;
    page: number;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
}
//# sourceMappingURL=get-cleanup-event-query.dto.d.ts.map