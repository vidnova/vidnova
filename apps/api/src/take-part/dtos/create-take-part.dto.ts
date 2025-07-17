import { IsString, IsUUID } from 'class-validator';

export class CreateTakePartDto {
  @IsString()
  @IsUUID()
  cleanupEventId: string;
}
