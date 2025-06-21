import { IsPointInSettlementCommand } from '../../commands';

export interface IIsPointInsideSettlement {
  execute(command: IsPointInSettlementCommand): Promise<boolean>;
}
