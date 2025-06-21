import { BaseCommand, CleanupEventStatus, CleanupSortBy, CleanupSortOrder } from '@ecorally/shared';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCleanupEventsCommand extends BaseCommand {
  @IsOptional()
  @IsUUID()
  regionId?: string;

  @IsOptional()
  @IsUUID()
  settlementId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  status?: CleanupEventStatus;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsEnum(CleanupSortBy)
  sortBy?: CleanupSortBy;

  @IsOptional()
  @IsEnum(CleanupSortOrder)
  sortOrder?: CleanupSortOrder;
}
