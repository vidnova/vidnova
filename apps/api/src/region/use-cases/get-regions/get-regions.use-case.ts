import { Inject, InternalServerErrorException } from '@nestjs/common';
import { IRegionRepository } from '@ecorally/dal';

export class GetRegionsUseCase {
  constructor(@Inject('REGION_REPOSITORY') private readonly regionRepository: IRegionRepository) {}

  async execute() {
    try {
      return this.regionRepository.getAll();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to get list of regions');
    }
  }
}
