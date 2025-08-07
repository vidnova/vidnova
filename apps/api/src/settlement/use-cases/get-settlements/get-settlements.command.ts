import { BaseCommand } from '@vidnova/shared';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class GetSettlementsCommand extends BaseCommand {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  region?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize?: number;
}
