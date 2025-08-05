import { JobTypes, QueueNames } from '../../enums';

export interface WebSocketDataDto<T> {
  queueName: QueueNames;
  jobType: JobTypes;
  payload: T;
}
