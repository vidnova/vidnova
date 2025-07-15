import { IsOptional, IsUUID } from 'class-validator';

export class GetSettlementsDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsUUID()
  region?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  pageSize?: number = 10;
}
