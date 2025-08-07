import { BaseCommand, JobTypes } from '@vidnova/shared';
import { IsEnum } from 'class-validator';
import { Message } from '@vidnova/dal';

export class ExternalServicesMessageRouteCommand extends BaseCommand {
  @IsEnum(JobTypes)
  jobType: JobTypes;

  payload: Message;
}
