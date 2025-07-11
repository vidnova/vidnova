import { BaseCommand } from '@ecorally/shared';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GetRegionsCommand extends BaseCommand {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize?: number;
}
