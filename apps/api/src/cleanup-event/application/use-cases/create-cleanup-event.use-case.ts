import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CleanupEventRepository } from '../../domain/interfaces/cleanup-event.repository.interface';
import { UpsertCleanupEventDto } from '../../infrastructure/dto/upsert-cleanup-event.dto';
import { IsPointInsideSettlement } from 'src/settlement/domain/interfaces/is-point-in-settlement-use-case.interface';
import { IsPointInRegion } from 'src/region/domain/interfaces/is-point-in-region.use-case.interface';
import { CleanupEvent } from '../../domain/entities/cleanup-event.entity';

@Injectable()
export class CreateCleanupEventUseCase {
  constructor(
    @Inject('CLEANUP_EVENT_REPOSITORY')
    private readonly cleanupEventRepository: CleanupEventRepository,
    @Inject('IS_POINT_INSIDE_SETTLEMENT')
    private readonly isPointInsideSettlement: IsPointInsideSettlement,
    @Inject('IS_POINT_INSIDE_REGION')
    private readonly isPointInsideRegion: IsPointInRegion,
  ) {}

  async execute(data: UpsertCleanupEventDto, organizerId: string): Promise<CleanupEvent> {
    try {
      let isPointInsideInCorrectRegion: boolean = false;
      let isPointInsideInCorrectSettlement: boolean = false;

      isPointInsideInCorrectRegion = await this.isPointInsideRegion.execute(
        data.regionId,
        data.location.longitude,
        data.location.latitude,
      );
      if (!isPointInsideInCorrectRegion)
        throw new ConflictException('The selected point is outside the selected settlement');

      if (data.settlementId) {
        isPointInsideInCorrectSettlement = await this.isPointInsideSettlement.execute(
          data.settlementId,
          data.location.longitude,
          data.location.latitude,
        );
      }

      if (!isPointInsideInCorrectSettlement)
        throw new ConflictException('The selected point is outside the selected region');

      const cleanupEvent = await this.cleanupEventRepository.create(data, organizerId);

      return CleanupEvent.create(cleanupEvent);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        `Failed to create a cleanup event: ${error instanceof Error ? error.message : error}`,
      );
    }
  }
}
