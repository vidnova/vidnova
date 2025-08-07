import { EnvironmentWithUserCommand } from '@vidnova/shared';
import { IsString, IsUUID } from 'class-validator';

export class CreateTakePartCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsUUID()
  eventId: string;
}
