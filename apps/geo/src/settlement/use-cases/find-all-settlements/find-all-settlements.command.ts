import { BaseCommand } from '@vidnova/shared';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class FindAllSettlementsCommand extends BaseCommand {
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

  @IsUUID()
  @IsOptional()
  region: string;
}
