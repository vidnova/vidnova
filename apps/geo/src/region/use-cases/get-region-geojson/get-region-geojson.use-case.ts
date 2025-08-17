import {
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GetRegionGeoJSONCommand } from './get-region-geojson.command';
import { IRegionRepository } from '@vidnova/geo-dal';

export class GetRegionGeoJSONUseCase {
  private logger = new Logger(GetRegionGeoJSONUseCase.name);

  constructor(
    @Inject('REGION_REPOSITORY')
    private readonly regionRepository: IRegionRepository,
  ) {}

  async execute(command: GetRegionGeoJSONCommand) {
    try {
      const geojson = await this.regionRepository.findRegionGeoJSON(
        command.regionId,
      );

      if (!geojson) {
        throw new NotFoundException(
          `Region with ID ${command.regionId} not found`,
        );
      }

      return geojson;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to get regions: ${error}`);
      throw new InternalServerErrorException('Failed to get regions');
    }
  }
}
