import { IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ReportTargetType } from '@ecorally/shared';

export class CreateReportDto {
  @IsString()
  @IsEnum(ReportTargetType)
  targetType: ReportTargetType;

  @IsString()
  @IsUUID()
  targetId: string;

  @IsString()
  @MinLength(5)
  reason: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  description: string | null;
}
