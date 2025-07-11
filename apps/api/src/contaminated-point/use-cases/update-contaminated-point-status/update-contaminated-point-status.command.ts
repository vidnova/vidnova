import { EnvironmentWithUserCommand } from '@ecorally/shared';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { ContaminatedPointStatusEnum } from '@ecorally/dal';

export class UpdateContaminatedPointStatusCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsUUID()
  contaminatedPointId: string;

  @IsString()
  @IsEnum(ContaminatedPointStatusEnum)
  status: ContaminatedPointStatusEnum;
}
