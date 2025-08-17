import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FindAllRegionsUseCase } from './use-cases/find-all-regions/find-all-regions.use-case';
import { FindAllRegionsDto } from './dtos/find-all-regions.dto';
import { FindAllRegionsCommand } from './use-cases/find-all-regions/find-all-regions.command';
import { GetRegionsGeoJSONUseCase } from './use-cases/get-regions-geojson/get-regions-geojson.use-case';
import { GetRegionGeoJSONUseCase } from './use-cases/get-region-geojson/get-region-geojson.use-case';
import { GetRegionGeoJSONCommand } from './use-cases/get-region-geojson/get-region-geojson.command';
import { RegionContainsPointDto } from './dtos/region-contains-point.dto';
import { RegionContainsPointUseCase } from './use-cases/region-contains-point/region-contains-point.use-case';
import { RegionContainsPointCommand } from './use-cases/region-contains-point/region-contains-point.command';

@Controller('regions')
export class RegionController {
  constructor(
    private readonly findAllRegionsUseCase: FindAllRegionsUseCase,
    private readonly getRegionsGeoJSONUseCase: GetRegionsGeoJSONUseCase,
    private readonly getRegionGeoJSONUseCase: GetRegionGeoJSONUseCase,
    private readonly regionContainsPointUseCase: RegionContainsPointUseCase,
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
    return this.getRegionsGeoJSONUseCase.execute();
  }

  @Get(':regionId/geojson')
  async getRegionGeoJSON(@Param('regionId') regionId: string) {
    return this.getRegionGeoJSONUseCase.execute(
      GetRegionGeoJSONCommand.create({
        regionId,
      }),
    );
  }

  @Post(':regionId/contains-point')
  async regionContainsPoint(
    @Body() data: RegionContainsPointDto,
    @Param('regionId') regionId: string,
  ) {
    return this.regionContainsPointUseCase.execute(
      RegionContainsPointCommand.create({
        regionId,
        ...data,
      }),
    );
  }
}
