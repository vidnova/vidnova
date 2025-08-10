import { IsNumber } from 'class-validator';

export class SettlementContainsPointDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;
}
