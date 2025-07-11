import { Controller, Get, Query } from '@nestjs/common';
import { GetRegionsUseCase } from './use-cases/get-regions/get-regions.use-case';
import { GetRegionsCommand } from './use-cases/get-regions/get-regions.command';
import { GetRegionsDto } from './dtos/get-regions.dto';

@Controller('regions')
export class RegionController {
  constructor(private readonly getRegionsUseCase: GetRegionsUseCase) {}

  @Get()
  async getAll(@Query() queries: GetRegionsDto) {
    return this.getRegionsUseCase.execute(
      GetRegionsCommand.create({
        ...queries,
        page: +queries.page,
        pageSize: +queries.pageSize,
      }),
    );
  }
}
