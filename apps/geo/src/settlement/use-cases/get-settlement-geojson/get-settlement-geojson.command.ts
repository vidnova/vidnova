import { BaseCommand } from '@vidnova/shared';
import { IsUUID } from 'class-validator';

export class GetSettlementGeoJSONCommand extends BaseCommand {
  @IsUUID()
  settlementId: string;
}
