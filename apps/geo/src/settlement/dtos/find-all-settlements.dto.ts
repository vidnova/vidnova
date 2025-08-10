import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindAllSettlementsDto {
  @IsString()
  @IsOptional()
  page: string;

  @IsString()
  @IsOptional()
  pageSize: string;

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder: 'asc' | 'desc' = 'asc';

  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  region: string;
}
