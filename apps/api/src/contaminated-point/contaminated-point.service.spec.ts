import { Test, TestingModule } from '@nestjs/testing';
import { ContaminatedPointService } from './contaminated-point.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegionService } from '../region/region.service';
import { SettlementService } from '../settlement/settlement.service';
import { RedisModule } from '../redis/redis.module';
import { OsmModule } from '../overpass/overpass.module';

describe('ContaminatedPointService', () => {
  let service: ContaminatedPointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule, OsmModule],
      providers: [
        ContaminatedPointService,
        PrismaService,
        RegionService,
        SettlementService,
      ],
    }).compile();

    service = module.get<ContaminatedPointService>(ContaminatedPointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
