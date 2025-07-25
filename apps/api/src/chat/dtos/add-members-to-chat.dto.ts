import { ArrayNotEmpty, IsArray, IsString, IsUUID } from 'class-validator';

export class AddMembersToChatDto {
  @IsArray()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  @ArrayNotEmpty()
  invitedUserIds: string[];
}
