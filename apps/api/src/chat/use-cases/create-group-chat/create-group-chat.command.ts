import { EnvironmentWithUserCommand } from '@vidnova/shared';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateGroupChatCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsOptional()
  @MinLength(1)
  name?: string = 'New group';

  @IsString()
  @IsOptional()
  @MinLength(5)
  description?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ArrayUnique()
  memberIds: string[];
}
