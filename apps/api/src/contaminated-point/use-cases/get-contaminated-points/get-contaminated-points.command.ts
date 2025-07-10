import { BaseCommand } from '@ecorally/shared';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ContaminatedPointStatusEnum } from '@ecorally/dal';

export class GetContaminatedPointsCommand extends BaseCommand {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsEnum(ContaminatedPointStatusEnum)
  status: ContaminatedPointStatusEnum;

  @IsOptional()
  @IsString()
  @IsUUID()
  regionId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  settlementId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize: number;
}
