import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';
import { IsDateAfter } from '../../common/decorators';
import {
  IGetCleanupEventQueryDto,
  CleanupSortBy,
  CleanupSortOrder,
  CleanupEventStatus,
} from '@vidnova/shared';

export class GetCleanupEventsQueryDto implements IGetCleanupEventQueryDto {
  @IsOptional()
  @IsUUID()
  regionId?: string;

  @IsOptional()
  @IsUUID()
  settlementId?: string;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  // eslint-disable-next-line
  @ValidateIf((o) => o.startDate && o.endDate)
  @IsDateAfter('startDate')
  endDate?: Date;

  @IsOptional()
  @IsString()
  status?: CleanupEventStatus;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  pageSize: number = 10;

  @IsOptional()
  page: number = 1;

  @IsOptional()
  @IsEnum(CleanupSortBy)
  sortBy?: CleanupSortBy;

  @IsOptional()
  @IsEnum(CleanupSortOrder)
  sortOrder?: CleanupSortOrder;

  @IsOptional()
  @IsUUID()
  user: string;
}
