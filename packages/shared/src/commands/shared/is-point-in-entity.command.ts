import { BaseCommand } from './base.command';
import { IsNumber, IsUUID } from 'class-validator';

export abstract class IsPointInEntityCommand extends BaseCommand {
  @IsNumber()
  lon: number;

  @IsNumber()
  lat: number;
}
