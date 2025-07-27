import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class UpdateChatInfoDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  name?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  description?: string;
}
