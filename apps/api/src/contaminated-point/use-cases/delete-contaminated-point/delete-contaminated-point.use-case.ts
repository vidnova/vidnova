import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { IContaminatedPointRepository } from '@vidnova/dal';
import { DeleteContaminatedPointCommand } from './delete-contaminated-point.command';

export class DeleteContaminatedPointUseCase {
  constructor(
    @Inject('CONTAMINATED_POINT_REPOSITORY')
    private readonly contaminatedPointRepository: IContaminatedPointRepository,
  ) {}

  async execute(command: DeleteContaminatedPointCommand) {
    const contaminatedPoint = await this.contaminatedPointRepository.findById(
      command.contaminatedPointId,
    );

    if (!contaminatedPoint) {
      throw new NotFoundException(
        `Contaminated point with ID ${command.contaminatedPointId} not found`,
      );
    }

    if (command.userId !== contaminatedPoint.creatorId) {
      throw new ForbiddenException('You have no access to change this content');
    }

    await this.contaminatedPointRepository.delete(contaminatedPoint.id);

    return 'Contaminated point was deleted successfully';
  }
}
