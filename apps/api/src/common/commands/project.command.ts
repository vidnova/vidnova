import { BaseCommand } from './base.command';
import { IsNotEmpty, IsUUID } from 'class-validator';

export abstract class EnvironmentWithUserCommand extends BaseCommand {
  @IsNotEmpty()
  @IsUUID()
  readonly userId: string;
}
