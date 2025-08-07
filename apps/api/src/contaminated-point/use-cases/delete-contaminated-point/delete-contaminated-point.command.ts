import { EnvironmentWithUserCommand } from '@vidnova/shared';
import { IsString, IsUUID } from 'class-validator';

export class DeleteContaminatedPointCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsUUID()
  contaminatedPointId: string;
}
