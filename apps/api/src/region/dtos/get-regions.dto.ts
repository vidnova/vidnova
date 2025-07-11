import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GetRegionsDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  pageSize?: number = 10;
}
