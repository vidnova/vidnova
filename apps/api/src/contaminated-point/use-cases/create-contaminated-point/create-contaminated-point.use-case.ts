import {
  ConflictException,
  HttpException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { ContaminatedPoint, IContaminatedPointRepository } from '@ecorally/dal';
import { CreateContaminatedPointCommand } from './create-contaminated-point.command';
import { Location, LocationValidationService } from '@ecorally/shared';

export class CreateContaminatedPointUseCase {
  constructor(
    @Inject('CONTAMINATED_POINT_REPOSITORY')
    private readonly contaminatedPointRepository: IContaminatedPointRepository,
    private readonly locationValidationService: LocationValidationService,
  ) {}

  async execute(command: CreateContaminatedPointCommand) {
    try {
      const validationResult = await this.locationValidationService.validateLocation(
        command.location.regionId,
        command.location.settlementId,
        command.location.longitude,
        command.location.latitude,
      );

      if (!validationResult.isValidLocation()) {
        throw new ConflictException(validationResult.getErrorMessage());
      }

      const contaminatedPointLocation = Location.create(
        command.location.latitude,
        command.location.longitude,
        command.location.regionId,
        command.location.settlementId,
      );
      const contaminatedPoint = ContaminatedPoint.create({
        ...command,
        creatorId: command.userId,
        location: contaminatedPointLocation,
      });

      return this.contaminatedPointRepository.create(contaminatedPoint);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        `Failed to create a contaminated point: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      );
    }
  }
}
