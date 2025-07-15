import { Controller, Get, Query } from '@nestjs/common';
import { GetSettlementsUseCase } from './use-cases/get-settlements/get-settlements.use-case';
import { GetSettlementsDto } from './dtos/get-settlements.dto';
import { GetSettlementsCommand } from './use-cases/get-settlements/get-settlements.command';

@Controller('settlements')
export class SettlementController {
  constructor(private readonly getSettlementsUseCase: GetSettlementsUseCase) {}

  @Get()
  async getAll(@Query() queries: GetSettlementsDto) {
    return this.getSettlementsUseCase.execute(
      GetSettlementsCommand.create({
        ...queries,
        page: +queries.page,
        pageSize: +queries.pageSize,
      }),
    );
  }
}
