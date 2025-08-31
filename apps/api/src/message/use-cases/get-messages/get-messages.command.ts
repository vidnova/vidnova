import { EnvironmentWithUserCommand } from '@vidnova/shared';
import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class GetMessagesCommand extends EnvironmentWithUserCommand {
  @IsUUID()
  chatId: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number;
}
