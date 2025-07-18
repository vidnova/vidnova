import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ContaminatedPointStatusEnum } from '@ecorally/dal';

export class GetContaminatedPointsQueryDto {
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
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize: number = 10;

  @IsOptional()
  @IsUUID()
  user: string;
}
