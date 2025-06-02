import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CleanupEvent } from '../../domain/entities/cleanup-event.entity';
import { CleanupEventRepository } from '../../domain/interfaces/cleanup-event.repository.interface';
import { RedisService } from '../../../redis/redis.service';
import { CLEANUP_EVENT_REPOSITORY } from '../../tokens/cleanup-event.repository.token';

@Injectable()
export class GetCleanupEventUseCase {
  private readonly logger = new Logger(GetCleanupEventUseCase.name);
  private readonly CACHE_TTL = 300;

  constructor(
    @Inject(CLEANUP_EVENT_REPOSITORY)
    private readonly cleanupEventRepository: CleanupEventRepository,
    private readonly redis: RedisService,
  ) {}

  async execute(id: string): Promise<CleanupEvent | null> {
    try {
      const cacheKey = `cleanup-event:${id}`;
      const cachedEvent = await this.redis.get(cacheKey);
      if (cachedEvent) {
        this.logger.debug(`Cache hit for cleanup event ${id}`);
        return JSON.parse(cachedEvent) as CleanupEvent;
      }

      const cleanupEvent = await this.cleanupEventRepository.getById(id);

      if (!cleanupEvent) throw new NotFoundException(`Cleanup event with id ${id} not found`);

      await this.redis.set(cacheKey, JSON.stringify(cleanupEvent), this.CACHE_TTL);

      return cleanupEvent;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Failed to get a cleanup event with id ${id}`,
        error instanceof Error ? error.message : error,
      );
    }
  }
}
