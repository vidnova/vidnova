import { BaseCommand } from '@vidnova/shared';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ContaminatedPointStatusEnum } from '@vidnova/dal';

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
  region: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  settlement: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize: number;

  @IsOptional()
  @IsUUID()
  user: string;
}
