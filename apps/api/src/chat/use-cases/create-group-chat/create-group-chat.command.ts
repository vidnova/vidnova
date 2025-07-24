import { EnvironmentWithUserCommand } from '@ecorally/shared';
import {
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
  @MinLength(1)
  name: string = 'New group';

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
  @ArrayUnique()
  memberIds: string[];
}
