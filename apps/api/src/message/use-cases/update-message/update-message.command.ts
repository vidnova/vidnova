import { EnvironmentWithUserCommand } from '@vidnova/shared';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateMessageCommand extends EnvironmentWithUserCommand {
  @IsUUID()
  messageId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content: string;
}
