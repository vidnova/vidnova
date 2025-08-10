import { BaseCommand } from '@vidnova/shared';
import { IsNumber, IsUUID } from 'class-validator';

export class SettlementContainsPointCommand extends BaseCommand {
  @IsUUID()
  settlementId: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;
}
