import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FindAllSettlementsUseCase } from './use-cases/find-all-settlements/find-all-settlements.use-case';
import { FindAllSettlementsDto } from './dtos/find-all-settlements.dto';
import { FindAllSettlementsCommand } from './use-cases/find-all-settlements/find-all-settlements.command';
import { GetSettlementGeoJSONUseCase } from './use-cases/get-settlement-geojson/get-settlement-geojson.use-case';
import { GetSettlementGeoJSONCommand } from './use-cases/get-settlement-geojson/get-settlement-geojson.command';
import { SettlementContainsPointUseCase } from './use-cases/settlement-contains-point/settlement-contains-point.use-case';
import { SettlementContainsPointDto } from './dtos/settlement-contains-point.dto';
import { SettlementContainsPointCommand } from './use-cases/settlement-contains-point/settlement-contains-point.command';

@Controller('settlements')
export class SettlementController {
  constructor(
    private readonly findAllSettlementsUseCase: FindAllSettlementsUseCase,
    private readonly getSettlementGeoJSONUseCase: GetSettlementGeoJSONUseCase,
    private readonly settlementContainsPointUseCase: SettlementContainsPointUseCase,
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

  @Post(':settlementId/contains-point')
  async settlementContainsPoint(
    @Param('settlementId') settlementId: string,
    @Body() data: SettlementContainsPointDto,
  ) {
    return this.settlementContainsPointUseCase.execute(
      SettlementContainsPointCommand.create({
        settlementId,
        ...data,
      }),
    );
  }
}
