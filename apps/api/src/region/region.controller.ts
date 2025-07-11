import { Controller, Get } from '@nestjs/common';
import { GetRegionsUseCase } from './use-cases/get-regions/get-regions.use-case';

@Controller('regions')
export class RegionController {
  constructor(private readonly getRegionsUseCase: GetRegionsUseCase) {}

  @Get()
  async getAll() {
    return this.getRegionsUseCase.execute();
  }
}
