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
import { EnvironmentWithUserCommand } from '@vidnova/shared';

class EquipmentItem {
  @IsString()
  @IsNotEmpty()
  equipmentId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateCleanupEventCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsUrl()
  imageUrl: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EquipmentItem)
  equipments: EquipmentItem[];

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsUUID()
  @IsNotEmpty()
  regionId: string;

  @IsOptional()
  @IsUUID()
  settlementId?: string;

  @IsArray()
  dates: Date[];
}
