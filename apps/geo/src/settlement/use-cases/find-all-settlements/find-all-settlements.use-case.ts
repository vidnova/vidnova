import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FindAllSettlementsCommand } from './find-all-settlements.command';
import { IRegionRepository } from '@vidnova/geo-dal';

@Injectable()
export class FindAllSettlementsUseCase {
  private logger = new Logger(FindAllSettlementsUseCase.name);

  constructor(
    @Inject('SETTLEMENT_REPOSITORY')
    private readonly settlementRepository: IRegionRepository,
  ) {}

  async execute(command: FindAllSettlementsCommand) {
    try {
      return this.settlementRepository.findAll({ ...command });
    } catch (error) {
      this.logger.error(`Failed to get regions: ${error}`);
      throw new InternalServerErrorException('Failed to get regions');
    }
  }
}
