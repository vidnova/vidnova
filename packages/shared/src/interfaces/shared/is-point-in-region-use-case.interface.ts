import { IsPointInRegionCommand } from '../../commands';

export interface IIsPointInRegion {
  execute(command: IsPointInRegionCommand): Promise<boolean>;
}
