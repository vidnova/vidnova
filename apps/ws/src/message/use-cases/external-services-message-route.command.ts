import { BaseCommand, JobTypes } from '@ecorally/shared';
import { IsEnum } from 'class-validator';
import { Message } from '@ecorally/dal';

export class ExternalServicesMessageRouteCommand extends BaseCommand {
  @IsEnum(JobTypes)
  jobType: JobTypes;

  payload: Message;
}
