import { GetSettlementGeoJSONCommand } from './get-settlement-geojson.command';
import {
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ISettlementRepository } from '@vidnova/geo-dal';

export class GetSettlementGeoJSONUseCase {
  private logger = new Logger(GetSettlementGeoJSONUseCase.name);

  constructor(
    @Inject('SETTLEMENT_REPOSITORY')
    private readonly settlementRepository: ISettlementRepository,
  ) {}

  async execute(command: GetSettlementGeoJSONCommand) {
    try {
      const geojson = await this.settlementRepository.findSettlementGeoJSON(
        command.settlementId,
      );

      if (!geojson) {
        throw new NotFoundException(
          `Settlement with ID ${command.settlementId} not found`,
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
