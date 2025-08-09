import { Controller, Get, Query } from '@nestjs/common';
import { FindAllRegionsUseCase } from './use-cases/find-all-regions/find-all-regions.use-case';
import { FindAllRegionsDto } from './dtos/find-all-regions.dto';
import { FindAllRegionsCommand } from './use-cases/find-all-regions/find-all-regions.command';

@Controller('regions')
export class RegionController {
  constructor(private readonly findAllRegionsUseCase: FindAllRegionsUseCase) {}

  @Get()
  async findAllRegions(@Query() query: FindAllRegionsDto) {
    return this.findAllRegionsUseCase.execute(
      FindAllRegionsCommand.create({
        page: query.page ? +query.page : 1,
        pageSize: query.pageSize ? +query.pageSize : 10,
        sortOrder: query.sortOrder ?? 'desc',
        name: query.name,
      }),
    );
  }
}
