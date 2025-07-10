import { BaseCommand } from '@ecorally/shared';
import { IsString, IsUUID } from 'class-validator';

export class GetContaminatedPointCommand extends BaseCommand {
  @IsString()
  @IsUUID()
  contaminatedPointId: string;
}
