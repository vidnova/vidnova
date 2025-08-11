import { BaseCommand } from '@vidnova/shared';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FindAllRegionsCommand extends BaseCommand {
  @IsNumber()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  pageSize: number = 10;

  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder: 'asc' | 'desc' = 'desc';

  @IsString()
  @IsOptional()
  name?: string;
}
