import { FindAllRegionsCommand } from './find-all-regions.command';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IRegionRepository } from '@vidnova/geo-dal';

@Injectable()
export class FindAllRegionsUseCase {
  private logger = new Logger(FindAllRegionsUseCase.name);

  constructor(
    @Inject('REGION_REPOSITORY')
    private readonly regionRepository: IRegionRepository,
  ) {}

  async execute(command: FindAllRegionsCommand) {
    try {
      return this.regionRepository.findAll({ ...command });
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to get regions: ${error}`);
      throw new InternalServerErrorException('Failed to get regions');
    }
  }
}
