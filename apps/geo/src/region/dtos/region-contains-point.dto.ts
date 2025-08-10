import { IsNumber } from 'class-validator';

export class RegionContainsPointDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;
}
