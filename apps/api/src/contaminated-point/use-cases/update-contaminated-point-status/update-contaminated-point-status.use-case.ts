import {
  ForbiddenException,
  HttpException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IContaminatedPointRepository, RedisService } from '@ecorally/dal';
import { UpdateContaminatedPointStatusCommand } from './update-contaminated-point-status.command';

export class UpdateContaminatedPointStatusUseCase {
  constructor(
    @Inject('CONTAMINATED_POINT_REPOSITORY')
    private readonly contaminatedPointRepository: IContaminatedPointRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(command: UpdateContaminatedPointStatusCommand) {
    try {
      const contaminatePoint = await this.contaminatedPointRepository.findById(
        command.contaminatedPointId,
      );

      if (!contaminatePoint) {
        throw new NotFoundException(
          `Contaminated point with ID ${command.contaminatedPointId} not found`,
        );
      }

      if (command.userId !== contaminatePoint.creatorId) {
        throw new ForbiddenException('You have no access to change this content');
      }

      await this.contaminatedPointRepository.updateStatus(
        command.contaminatedPointId,
        command.status,
      );

      await this.redisService.delete(`contaminated-point:${command.contaminatedPointId}`);

      return 'Contaminated point status was updated successfully';
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to update contaminated point status');
    }
  }
}
