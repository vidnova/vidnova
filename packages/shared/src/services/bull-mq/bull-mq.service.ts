import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { QueueNames } from '../../enums';

@Injectable()
export class BullMqService {
  private logger = new Logger(BullMqService.name);
  private queues: Map<string, Queue> = new Map();

  constructor() {
    this.initializeQueue(QueueNames.MESSAGE_QUEUE);
  }

  private initializeQueue(queueName: string): void {
    try {
      const queue = new Queue(queueName, {
        connection: {
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT) || 6432,
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
        },
      });
      this.queues.set(queueName, queue);
      this.logger.log(`Initialized queue ${queueName}`);
    } catch (error) {
      this.logger.error(`Failed to initialize queue ${queueName}: `, error);
      throw error;
    }
  }

  getQueue(queueName: string): Queue {
    let queue = this.queues.get(queueName);
    if (!queue) {
      this.initializeQueue(queueName);
      queue = this.queues.get(queueName);
    }
    return queue;
  }

  async addJob<T>(queueName: string, jobType: string, data: T): Promise<Job<T>> {
    try {
      const queue = this.getQueue(queueName);
      const job = await queue.add(jobType, data);

      this.logger.debug(`Added job ${job.id} to queue ${queueName}`);

      return job;
    } catch (error) {
      this.logger.error(`Failed to add job to queue ${queueName}`, error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      for (const queue of this.queues.values()) {
        await queue.close();
        this.logger.log(`Closed queue ${queue.name}`);
      }
    } catch (error) {
      this.logger.error('Failed to close queues', error);
    }
  }
}
