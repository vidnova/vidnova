import { Processor } from '@nestjs/bullmq';
import { QueueNames } from '@ecorally/shared';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { Job } from 'bullmq';
import { Message } from '@ecorally/dal';

@Processor(QueueNames.MESSAGE_QUEUE)
export class MessageProcessor {
  constructor(@Inject('PUB_SUB_REDIS') private readonly redis: Redis) {}

  async process(job: Job<Message>) {
    const message = job.data;

    await this.redis.publish(
      'ws.send',
      JSON.stringify({
        type: 'message',
        userId: message.sender.id,
        payload: message,
      }),
    );
  }
}
