import { EnvironmentWithUserCommand } from '@ecorally/shared';
import { IsNumber, IsOptional, IsString, IsUrl, IsUUID, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

class Location {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsUUID()
  regionId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  settlementId?: string;
}

export class CreateContaminatedPointCommand extends EnvironmentWithUserCommand {
  @IsString()
  @MinLength(8)
  name: string;

  @IsString()
  @MinLength(32)
  description: string;

  @IsString()
  @IsUrl()
  imageUrl: string;

  @Type(() => Location)
  location: Location;
}
