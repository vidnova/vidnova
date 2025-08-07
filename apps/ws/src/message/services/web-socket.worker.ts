import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { QueueNames, WebSocketDataDto } from '@vidnova/shared';
import { Message } from '@vidnova/dal';
import { Job } from 'bullmq';
import { ExternalServicesMessageRoute } from '../use-cases/external-services-message-route';
import { ExternalServicesMessageRouteCommand } from '../use-cases/external-services-message-route.command';

@Processor(QueueNames.MESSAGE_QUEUE)
export class MessageWorker extends WorkerHost {
  private logger = new Logger(MessageWorker.name);

  constructor(
    private readonly externalServicesMessageRoute: ExternalServicesMessageRoute,
  ) {
    super();
    this.logger.log('MessageWorker initialized');
  }

  async process(job: Job<WebSocketDataDto<Message>>) {
    try {
      const data = job.data;
      this.logger.debug(`Processing job ${job.id} of type ${data.jobType}`);

      if (data.queueName === QueueNames.MESSAGE_QUEUE) {
        await this.externalServicesMessageRoute.execute(
          ExternalServicesMessageRouteCommand.create({
            jobType: data.jobType,
            payload: data.payload,
          }),
        );
      }
    } catch (error) {
      this.logger.error(`Failed to process job ${job.id}:`, error);
      throw error;
    }
  }
}
