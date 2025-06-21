import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnvironmentWithUserCommand } from '@ecorally/shared';

class EquipmentItem {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  equipmentId?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;
}

export class UpdateCleanupEventCommand extends EnvironmentWithUserCommand {
  @IsUUID()
  cleanupEventId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EquipmentItem)
  equipment?: EquipmentItem[];

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  regionId?: string;

  @IsOptional()
  @IsUUID()
  settlementId?: string;

  @IsOptional()
  @IsArray()
  eventDates?: Date[];
}
