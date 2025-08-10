import { BaseCommand } from '@vidnova/shared';
import { IsNumber, IsUUID } from 'class-validator';

export class RegionContainsPointCommand extends BaseCommand {
  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;

  @IsUUID()
  regionId: string;
}
