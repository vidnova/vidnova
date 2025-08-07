import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsUrl,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ICreateCleanupEventDto } from '@vidnova/shared';

class EquipmentItemDto {
  @IsString()
  @IsNotEmpty()
  equipmentId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateCleanupEventDto implements ICreateCleanupEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsUrl()
  imageUrl: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EquipmentItemDto)
  equipments: EquipmentItemDto[];

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsNotEmpty()
  regionId: string;

  @IsString()
  @IsOptional()
  settlementId?: string;

  @IsArray()
  dates: Date[];
}
