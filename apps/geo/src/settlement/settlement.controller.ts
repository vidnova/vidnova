import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindAllSettlementsUseCase } from './use-cases/find-all-settlements/find-all-settlements.use-case';
import { FindAllSettlementsDto } from './dtos/find-all-settlements.dto';
import { FindAllSettlementsCommand } from './use-cases/find-all-settlements/find-all-settlements.command';
import { GetSettlementGeoJSONUseCase } from './use-cases/get-settlement-geojson/get-settlement-geojson.use-case';
import { GetSettlementGeoJSONCommand } from './use-cases/get-settlement-geojson/get-settlement-geojson.command';

@Controller('settlements')
export class SettlementController {
  constructor(
    private readonly findAllSettlementsUseCase: FindAllSettlementsUseCase,
    private readonly getSettlementGeoJSONUseCase: GetSettlementGeoJSONUseCase,
  ) {}

  @Get()
  async findAll(@Query() query: FindAllSettlementsDto) {
    return this.findAllSettlementsUseCase.execute(
      FindAllSettlementsCommand.create({
        page: query.page ? +query.page : 1,
        pageSize: query.pageSize ? +query.pageSize : 10,
        sortOrder: query.sortOrder ?? 'desc',
        name: query.name,
        region: query.region,
      }),
    );
  }

  @Get(':settlementId/geojson')
  async getSettlementGeoJSON(@Param('settlementId') settlementId: string) {
    return this.getSettlementGeoJSONUseCase.execute(
      GetSettlementGeoJSONCommand.create({
        settlementId,
      }),
    );
  }
}
