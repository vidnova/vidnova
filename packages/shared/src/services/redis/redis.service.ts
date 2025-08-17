import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redis!: Redis;
  private readonly logger = new Logger(RedisService.name);

  async onModuleInit() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    });
    this.logger.log('Redis connected');
  }

  async onModuleDestroy() {
    await this.redis.quit();
    this.logger.log('Redis disconnected');
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to get key ${key}: ${error.message}`);
      } else {
        this.logger.error(`Failed to get key ${key}: Unknown error`);
      }
      throw new Error('Redis operation failed');
    }
  }

  async set(key: string, value: string | number, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redis.set(key, value.toString(), 'EX', ttl);
      } else {
        await this.redis.set(key, value.toString());
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to set key ${key}: ${error.message}`);
      }

      throw new Error('Redis operation failed');
    }
  }

  async increment(key: string, ttl?: number): Promise<number> {
    try {
      const result = await this.redis.incr(key);
      if (result === 1 && ttl) {
        await this.redis.expire(key, ttl);
      }
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to increment key ${key}: ${error.message}`);
      }
      throw new Error('Redis operation failed');
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to delete key ${key}: ${error.message}`);
      }
      throw new Error('Redis operation failed');
    }
  }

  async getTtl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to get TTL for key ${key}: ${error.message}`);
      }
      throw new Error('Redis operation failed');
    }
  }
}
