import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CleanupEventRepository } from '../../domain/interfaces/cleanup-event-repository.interface';
import { CleanupEvent } from '../../domain/entities/cleanup-event.entity';
import { UpdateCleanupEventCommand } from '../commands/update-cleanup-event.command';
import { EquipmentItem } from '../../domain/value-objects/equipment-item.vo';
import { RedisService } from '../../../redis/redis.service';
import { LocationValidationService } from '../../../domain/services/location-validation.service';

@Injectable()
export class UpdateCleanupEventUseCase {
  constructor(
    @Inject('CLEANUP_EVENT_REPOSITORY')
    private readonly cleanupEventRepository: CleanupEventRepository,
    private readonly locationValidationService: LocationValidationService,
    private readonly redis: RedisService,
  ) {}

  async execute(command: UpdateCleanupEventCommand): Promise<CleanupEvent> {
    try {
      const cleanupEvent = await this.cleanupEventRepository.getById(command.cleanupEventId);

      if (!cleanupEvent)
        throw new NotFoundException(`Cleanup event with ID: ${command.cleanupEventId} not found`);

      if (cleanupEvent.organizerId !== command.userId) {
        throw new ForbiddenException('You have no access to change this event.');
      }

      const validationResult = await this.locationValidationService.validateLocation(
        command.regionId,
        command.settlementId,
        command.longitude,
        command.latitude,
      );

      if (!validationResult.isValidLocation()) {
        throw new ConflictException(validationResult.getErrorMessage());
      }

      const equipmentItems = command.equipment.map(
        (eq) => new EquipmentItem(eq.equipmentId, eq.quantity),
      );

      const updatedCleanupEvent = CleanupEvent.update(
        command.cleanupEventId,
        command.name,
        command.description,
        command.startDate,
        command.endDate,
        command.imageUrl,
        command.userId,
        equipmentItems,
        command.longitude,
        command.latitude,
        command.regionId,
        command.settlementId,
        command.eventDates,
        cleanupEvent.createdAt,
      );

      await this.redis.delete(`cleanup-event:${command.cleanupEventId}`);

      return updatedCleanupEvent;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        `Failed to update cleanup event: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      );
    }
  }
}
