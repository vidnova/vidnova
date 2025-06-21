import { IsPointInEntityCommand } from '../shared';
import { IsUUID } from 'class-validator';

export class IsPointInRegionCommand extends IsPointInEntityCommand {
  @IsUUID()
  regionId: string;
}
