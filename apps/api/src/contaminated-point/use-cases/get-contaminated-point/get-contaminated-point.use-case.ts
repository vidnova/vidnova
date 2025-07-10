import {
  HttpException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IContaminatedPointRepository } from '@ecorally/dal';
import { GetContaminatedPointCommand } from './get-contaminated-point.command';

export class GetContaminatedPointUseCase {
  constructor(
    @Inject('CONTAMINATED_POINT_REPOSITORY')
    private readonly contaminatedPointRepository: IContaminatedPointRepository,
  ) {}

  async execute(command: GetContaminatedPointCommand) {
    try {
      const contaminatedPoint = await this.contaminatedPointRepository.getById(
        command.contaminatedPointId,
      );

      if (!contaminatedPoint) {
        throw new NotFoundException(
          `Contaminated point with ID ${command.contaminatedPointId} not found`,
        );
      }

      return contaminatedPoint;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to get contaminated point');
    }
  }
}
