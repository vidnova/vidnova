import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { QueueNames } from '../../enums';

@Injectable()
export class BullMqService {
  private queues: Map<string, Queue> = new Map();

  constructor() {
    this.queues.set(
      QueueNames.MESSAGE_QUEUE,
      new Queue(QueueNames.MESSAGE_QUEUE, {
        connection: {
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT) || 6437,
        },
      }),
    );
  }

  getQueue(queueName: string): Queue {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    return queue;
  }

  async addJob<T>(queueName: string, jobType: string, data: T): Promise<Job<T>> {
    const queue = this.getQueue(queueName);
    return queue.add(jobType, data);
  }

  async closeAll(): Promise<void> {
    for (const queue of this.queues.values()) {
      await queue.close()
    }
  }
}
