import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ContaminatedPoint, ContaminatedPointRepository, RedisService } from '@ecorally/dal';
import { UpdateContaminatedPointCommand } from './update-contaminated-point.command';
import { Location, LocationValidationService } from '@ecorally/shared';

export class UpdateContaminatedPointUseCase {
  constructor(
    @Inject('CONTAMINATED_POINT_REPOSITORY')
    private readonly contaminatedPointRepository: ContaminatedPointRepository,
    private readonly redisService: RedisService,
    private readonly locationValidationService: LocationValidationService,
  ) {}

  async execute(command: UpdateContaminatedPointCommand) {
    try {
      const contaminatedPoint = await this.contaminatedPointRepository.findById(command.id);

      if (!contaminatedPoint) {
        throw new NotFoundException(`Contaminated point with id ${command.id} not found`);
      }

      if (command.userId !== contaminatedPoint.creatorId) {
        throw new ForbiddenException('You have no access to change this content');
      }

      const validationResult = await this.locationValidationService.validateLocation(
        command.location.regionId,
        command.location.settlementId,
        command.location.longitude,
        command.location.latitude,
      );

      if (!validationResult.isValidLocation()) {
        throw new ConflictException(validationResult.getErrorMessage());
      }

      const updateContaminatedPointLocation = Location.create(
        command.location.latitude,
        command.location.longitude,
        command.location.regionId,
        command.location.settlementId,
      );

      const updateContaminatedPoint = ContaminatedPoint.update({
        ...command,
        creatorId: command.userId,
        location: updateContaminatedPointLocation,
      });

      const updatedContaminatedPoint =
        await this.contaminatedPointRepository.update(updateContaminatedPoint);

      await this.redisService.delete(`contaminated-point:${command.id}`);

      return updatedContaminatedPoint;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to update contaminated point');
    }
  }
}
