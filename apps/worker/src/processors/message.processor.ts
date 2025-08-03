import { Processor } from '@nestjs/bullmq';
import { Channels, QueueNames } from '@ecorally/shared';
import { Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { Job } from 'bullmq';
import { Message } from '@ecorally/dal';

@Processor(QueueNames.MESSAGE_QUEUE)
export class MessageProcessor {
  private readonly logger = new Logger(MessageProcessor.name);

  constructor(@Inject('PUB_SUB_REDIS') private readonly redis: Redis) {}

  async process(job: Job<Message>) {
    const message = job.data;
    this.logger.debug(
      `Processing job ${job.id} with message: ${JSON.stringify(message)}`,
    );

    try {
      await this.redis.publish(
        Channels.WS_SEND,
        JSON.stringify({
          type: 'message',
          userId: message.sender.id,
          payload: message,
        }),
      );
      this.logger.log(
        `Published message to ${Channels.WS_SEND} for user ${message.sender.id}`,
      );
    } catch (error) {
      this.logger.error(`Failed to publish message for job ${job.id}`, error);
      throw error;
    }
  }
}
