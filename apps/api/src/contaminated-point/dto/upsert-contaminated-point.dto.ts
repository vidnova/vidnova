import { ContaminatedPointStatus } from '@prisma/client';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MinLength,
} from 'class-validator';

export class UpsertContaminatedPointDto {
  @IsUrl()
  imageUrl: string;

  @MinLength(8)
  @IsString()
  name: string;

  @MinLength(8)
  @IsString()
  description: string;

  @IsString()
  status: ContaminatedPointStatus;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsUUID()
  @IsOptional()
  settlementId?: string;

  @IsUUID()
  regionId: string;
}
