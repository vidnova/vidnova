import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import {
  BullMqService,
  Channels,
  JobTypes,
  QueueNames,
} from '@ecorally/shared';
import { Message } from '@ecorally/dal';

@Injectable()
export class RedisSubscribers implements OnModuleInit {
  private logger = new Logger(RedisSubscribers.name);

  constructor(
    @Inject('REDIS_SUB_CLIENT') private readonly redisSub: Redis,
    private readonly bullMqService: BullMqService,
  ) {}

  async onModuleInit() {
    try {
      await this.redisSub.ping();
      this.logger.log('Connected to Redis for subscription');

      await this.redisSub.subscribe(Channels.MESSAGE_RECEIVED);
      this.logger.log(`Subscribed to ${Channels.MESSAGE_RECEIVED} channel`);

      this.redisSub.on('message', this.handleMessage.bind(this));
    } catch (error) {
      this.logger.error('Failed to initialize Redis subscription', error);
      throw error;
    }
  }

  private handleMessage(channel: string, rawMessage: string): Promise<void> {
    if (channel !== Channels.MESSAGE_RECEIVED.toString()) {
      return Promise.resolve();
    }

    return (async () => {
      try {
        const payload = JSON.parse(rawMessage) as Message;
        this.logger.debug(`Received message on ${channel}: ${rawMessage}`);

        await this.bullMqService.addJob<Message>(
          QueueNames.MESSAGE_QUEUE,
          JobTypes.SEND_MESSAGE,
          payload,
        );
      } catch (error) {
        this.logger.log(`Failed to process message on ${channel}`, error);
      }
    })();
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.redisSub.quit();
      this.logger.log('Disconnected Redis subscription client');
    } catch (error) {
      this.logger.log(
        'Failed to disconnect Redis subscription client: ',
        error,
      );
    }
  }
}
