import { ArrayMinSize, ArrayUnique, IsArray, IsString, IsUUID } from 'class-validator';

export class CreateGroupChatDto {
  @IsArray()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  @ArrayUnique()
  memberIds: string[];
}
