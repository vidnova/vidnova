import { EnvironmentWithUserCommand, ReportTargetType } from '@ecorally/shared';
import { IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateReportCommand extends EnvironmentWithUserCommand {
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
