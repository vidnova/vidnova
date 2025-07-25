import { EnvironmentWithUserCommand } from '@ecorally/shared';
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsString, IsUUID } from 'class-validator';

export class AddMembersToChatCommand extends EnvironmentWithUserCommand {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  @ArrayMaxSize(100)
  invitedUserIds: string[];

  @IsString()
  @IsUUID()
  chatId: string;
}
