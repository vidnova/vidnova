import { Inject, InternalServerErrorException } from '@nestjs/common';
import { IRegionRepository } from '@ecorally/dal';
import { GetRegionsCommand } from './get-regions.command';

export class GetRegionsUseCase {
  constructor(@Inject('REGION_REPOSITORY') private readonly regionRepository: IRegionRepository) {}

  async execute(command: GetRegionsCommand) {
    try {
      return this.regionRepository.getAll(
        { name: command.name },
        { page: command.page, pageSize: command.pageSize },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to get list of regions');
    }
  }
}
