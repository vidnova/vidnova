import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IRegionRepository } from '@vidnova/geo-dal';

@Injectable()
export class GetRegionsGeoJSONUseCase {
  private logger = new Logger(GetRegionsGeoJSONUseCase.name);

  constructor(
    @Inject('REGION_REPOSITORY')
    private readonly regionRepository: IRegionRepository,
  ) {}

  async execute() {
    try {
      return this.regionRepository.findRegionsGeoJSON();
    } catch (error) {
      this.logger.error(`Failed to get regions: ${error}`);
      throw new InternalServerErrorException('Failed to get regions');
    }
  }
}
