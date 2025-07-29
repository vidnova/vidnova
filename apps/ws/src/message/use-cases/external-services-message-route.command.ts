import { BaseCommand } from '@ecorally/shared';
import { IsEnum, IsUUID } from 'class-validator';
import { WebSocketMessageEvents } from '../enums/message-events.enum';

export class ExternalServicesMessageRouteCommand extends BaseCommand {
  @IsUUID()
  userId: string;

  @IsUUID()
  chatId: string;

  @IsEnum(WebSocketMessageEvents)
  event: WebSocketMessageEvents;

  payload: unknown;
}
