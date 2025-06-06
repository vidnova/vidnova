import { Test, TestingModule } from '@nestjs/testing';
import { ContaminatedPointController } from './contaminated-point.controller';
import { ContaminatedPointService } from './contaminated-point.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegionService } from '../region/region.service';
import { SettlementService } from '../settlement/settlement.service';
import { RedisModule } from '../redis/redis.module';
import { OsmModule } from '../overpass/overpass.module';

describe('ContaminatedPointController', () => {
  let controller: ContaminatedPointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule, OsmModule],
      controllers: [ContaminatedPointController],
      providers: [
        ContaminatedPointService,
        PrismaService,
        RegionService,
        SettlementService,
      ],
    }).compile();

    controller = module.get<ContaminatedPointController>(
      ContaminatedPointController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
