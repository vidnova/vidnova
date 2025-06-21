import { IsPointInEntityCommand } from '../shared';
import { IsUUID } from 'class-validator';

export class IsPointInSettlementCommand extends IsPointInEntityCommand {
  @IsUUID()
  settlementId: string;
}
