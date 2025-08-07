import { EnvironmentWithUserCommand, MessageAttachmentType, MessageType } from '@vidnova/shared';
import {
  ArrayNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMessageCommand extends EnvironmentWithUserCommand {
  @IsUUID()
  chatId: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  content?: string;

  @IsEnum(MessageType)
  type: MessageType;

  @ValidateNested({ each: true })
  @Type(() => MessageAttachment)
  @IsOptional()
  @ArrayNotEmpty()
  attachments?: MessageAttachment[];

  @IsUUID()
  @IsOptional()
  replyToMessageId?: string;
}

class MessageAttachment {
  @IsString()
  @MinLength(1)
  fileName: string;

  @IsNumber()
  fileSize: number;

  @IsString()
  @MinLength(1)
  mimeType: string;

  @IsUrl()
  url: string;

  @IsEnum(MessageAttachmentType)
  type: MessageAttachmentType;

  @IsUUID()
  messageId: string;
}
