import {
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GetRegionGeoJSONCommand } from './get-region-geojson.command';
import { IRegionRepository } from '@vidnova/geo-dal';
import { RedisService } from '@vidnova/shared';
import { FeatureCollection } from 'geojson';

export class GetRegionGeoJSONUseCase {
  private logger = new Logger(GetRegionGeoJSONUseCase.name);
  private CACHE_TTL = 604800;

  constructor(
    @Inject('REGION_REPOSITORY')
    private readonly regionRepository: IRegionRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(command: GetRegionGeoJSONCommand) {
    try {
      const cacheKey = `region-geojson:${command.regionId}`;
      const cachedRegionGeoJSON = await this.redisService.get(cacheKey);

      if (cachedRegionGeoJSON) {
        this.logger.debug(`Cache hit for region ${command.regionId}`);
        return JSON.parse(cachedRegionGeoJSON) as FeatureCollection;
      }

      const geojson = await this.regionRepository.findRegionGeoJSON(
        command.regionId,
      );

      if (!geojson) {
        throw new NotFoundException(
          `Region with ID ${command.regionId} not found`,
        );
      }

      await this.redisService.set(
        cacheKey,
        JSON.stringify(geojson),
        this.CACHE_TTL,
      );

      this.logger.debug(`Cache set for region ${command.regionId}`);

      return geojson;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to get regions: ${error}`);
      throw new InternalServerErrorException('Failed to get regions');
    }
  }
}
