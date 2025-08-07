import { ContaminatedPointStatusEnum } from '@vidnova/dal';
import { IsEnum, IsString } from 'class-validator';

export class UpdateContaminatedPointStatusDto {
  @IsString()
  @IsEnum(ContaminatedPointStatusEnum)
  status: ContaminatedPointStatusEnum;
}
