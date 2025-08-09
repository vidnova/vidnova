import { Controller, Get, Query } from '@nestjs/common';
import { FindAllRegionsUseCase } from './use-cases/find-all-regions/find-all-regions.use-case';
import { FindAllRegionsDto } from './dtos/find-all-regions.dto';
import { FindAllRegionsCommand } from './use-cases/find-all-regions/find-all-regions.command';
import { GetRegionsGeoJSONUseCase } from './use-cases/get-regions-geojson/get-regions-geojson.use-case';

@Controller('regions')
export class RegionController {
  constructor(
    private readonly findAllRegionsUseCase: FindAllRegionsUseCase,
    private readonly getRegionsGeoJSONUseCase: GetRegionsGeoJSONUseCase,
  ) {}

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

  @Get('geojson')
  async getGeoJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.getRegionsGeoJSONUseCase.execute();
  }
}
