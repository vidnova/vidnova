import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindAllRegionsDto {
  @IsString()
  @IsOptional()
  page: string;

  @IsString()
  @IsOptional()
  pageSize: string;

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder: 'asc' | 'desc' = 'desc';

  @IsString()
  @IsOptional()
  name?: string;
}
