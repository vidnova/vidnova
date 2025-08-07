import { EnvironmentWithUserCommand } from '@vidnova/shared';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { ContaminatedPointStatusEnum } from '@vidnova/dal';

export class UpdateContaminatedPointStatusCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsUUID()
  contaminatedPointId: string;

  @IsString()
  @IsEnum(ContaminatedPointStatusEnum)
  status: ContaminatedPointStatusEnum;
}
