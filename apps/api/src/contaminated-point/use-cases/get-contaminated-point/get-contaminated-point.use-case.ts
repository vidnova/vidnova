import {
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ContaminatedPoint, IContaminatedPointRepository, RedisService } from '@ecorally/dal';
import { GetContaminatedPointCommand } from './get-contaminated-point.command';

export class GetContaminatedPointUseCase {
  private readonly logger = new Logger(GetContaminatedPointUseCase.name);
  private readonly CACHE_TTL = 300;

  constructor(
    @Inject('CONTAMINATED_POINT_REPOSITORY')
    private readonly contaminatedPointRepository: IContaminatedPointRepository,
    private readonly redis: RedisService,
  ) {}

  async execute(command: GetContaminatedPointCommand) {
    try {
      const cacheKey = `contaminated-point:${command.contaminatedPointId}`;
      const cachedPoint = await this.redis.get(cacheKey);
      if (cachedPoint) {
        this.logger.log(`Cache hit for contaminated point ${command.contaminatedPointId}`);
        return JSON.parse(cachedPoint) as ContaminatedPoint;
      }

      const contaminatedPoint = await this.contaminatedPointRepository.getById(
        command.contaminatedPointId,
      );

      if (!contaminatedPoint) {
        throw new NotFoundException(
          `Contaminated point with ID ${command.contaminatedPointId} not found`,
        );
      }

      await this.redis.set(cacheKey, JSON.stringify(contaminatedPoint), this.CACHE_TTL);
      this.logger.log(`Cache was set for contaminated point ${command.contaminatedPointId}`);

      return contaminatedPoint;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to get contaminated point');
    }
  }
}
