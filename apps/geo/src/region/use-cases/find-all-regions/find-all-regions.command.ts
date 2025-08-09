import { BaseCommand } from '@vidnova/shared';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllRegionsCommand extends BaseCommand {
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @IsNumber()
  @IsOptional()
  pageSize: number = 10;

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder: 'asc' | 'desc' = 'desc';

  @IsString()
  @IsOptional()
  name?: string;
}
