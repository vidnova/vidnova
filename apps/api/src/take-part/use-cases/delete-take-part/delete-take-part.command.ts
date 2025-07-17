import { EnvironmentWithUserCommand } from '@ecorally/shared';
import { IsString, IsUUID } from 'class-validator';

export class DeleteTakePartCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsUUID()
  takePartId: string;
}
