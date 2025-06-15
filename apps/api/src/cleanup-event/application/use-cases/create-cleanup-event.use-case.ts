import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CleanupEventRepository } from '../../domain/interfaces/cleanup-event-repository.interface';
import { CleanupEvent } from '../../domain/entities/cleanup-event.entity';
import { CreateCleanupEventCommand } from '../commands/create-cleanup-event.command';
import { EquipmentItem } from '../../domain/value-objects/equipment-item.vo';
import { LocationValidationService } from '../../../domain/services/location-validation.service';

@Injectable()
export class CreateCleanupEventUseCase {
  constructor(
    @Inject('CLEANUP_EVENT_REPOSITORY')
    private readonly cleanupEventRepository: CleanupEventRepository,
    private readonly locationValidationService: LocationValidationService,
  ) {}

  async execute(command: CreateCleanupEventCommand): Promise<CleanupEvent> {
    try {
      const validationResult = await this.locationValidationService.validateLocation(
        command.regionId,
        command.settlementId,
        command.longitude,
        command.latitude,
      );

      if (!validationResult.isValidLocation()) {
        throw new ConflictException(validationResult.getErrorMessage());
      }

      const equipmentItems = command.equipments.map(
        (eq) => new EquipmentItem(eq.equipmentId, eq.quantity),
      );

      const cleanupEvent = CleanupEvent.create(
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
        command.dates,
      );

      return this.cleanupEventRepository.create(cleanupEvent);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        `Failed to create a cleanup event: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      );
    }
  }
}
