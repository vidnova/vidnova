import { BaseCommand } from '@vidnova/shared';
import { IsUUID } from 'class-validator';

export class GetRegionGeoJSONCommand extends BaseCommand {
  @IsUUID()
  regionId: string;
}
