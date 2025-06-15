import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CleanupEvent } from '../../domain/entities/cleanup-event.entity';
import { CleanupEventRepository } from '../../domain/interfaces/cleanup-event-repository.interface';
import { RedisService } from '../../../redis/redis.service';
import { GetCleanupEventCommand } from '../commands/get-cleanup-event.command';

@Injectable()
export class GetCleanupEventUseCase {
  private readonly logger = new Logger(GetCleanupEventUseCase.name);
  private readonly CACHE_TTL = 300;

  constructor(
    @Inject('CLEANUP_EVENT_REPOSITORY')
    private readonly cleanupEventRepository: CleanupEventRepository,
    private readonly redis: RedisService,
  ) {}

  async execute(command: GetCleanupEventCommand): Promise<CleanupEvent | null> {
    try {
      const cacheKey = `cleanup-event:${command.cleanupEventId}`;
      const cachedEvent = await this.redis.get(cacheKey);
      if (cachedEvent) {
        this.logger.debug(`Cache hit for cleanup event ${command.cleanupEventId}`);
        return JSON.parse(cachedEvent) as CleanupEvent;
      }

      const cleanupEvent = await this.cleanupEventRepository.getById(command.cleanupEventId);

      if (!cleanupEvent)
        throw new NotFoundException(`Cleanup event with id ${command.cleanupEventId} not found`);

      await this.redis.set(cacheKey, JSON.stringify(cleanupEvent), this.CACHE_TTL);

      return cleanupEvent;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Failed to get a cleanup event with id ${command.cleanupEventId}`,
        error instanceof Error ? error.message : error,
      );
    }
  }
}
