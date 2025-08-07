import { Inject, InternalServerErrorException } from '@nestjs/common';
import { IContaminatedPointRepository } from '@vidnova/dal';
import { GetContaminatedPointsCommand } from './get-contaminated-points.command';

export class GetContaminatedPointsUseCase {
  constructor(
    @Inject('CONTAMINATED_POINT_REPOSITORY')
    private readonly contaminatedPointRepository: IContaminatedPointRepository,
  ) {}

  async execute(command: GetContaminatedPointsCommand) {
    try {
      return this.contaminatedPointRepository.getAll(
        { ...command },
        {
          page: command.page,
          pageSize: command.pageSize,
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to get contaminated points');
    }
  }
}
