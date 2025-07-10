import { Module } from '@nestjs/common';
import {
  BlacklistedTokenRepository,
  CachingOverpassRepository,
  CleanupEventRepository,
  ContaminatedPointRepository,
  OtpRepository,
  OverpassRepository,
  PrismaService,
  RedisService,
  RegionRepository,
  SettlementRepository,
  UserRepository,
} from '@ecorally/dal';

@Module({
  providers: [
    PrismaService,
    RedisService,
    {
      provide: 'CLEANUP_EVENT_REPOSITORY',
      useClass: CleanupEventRepository,
    },
    {
      provide: 'BASE_OVERPASS_REPOSITORY',
      useClass: OverpassRepository,
    },
    {
      provide: 'OVERPASS_REPOSITORY',
      useClass: CachingOverpassRepository,
    },
    {
      provide: 'OTP_REPOSITORY',
      useClass: OtpRepository,
    },
    {
      provide: 'REGION_REPOSITORY',
      useClass: RegionRepository,
    },
    {
      provide: 'SETTLEMENT_REPOSITORY',
      useClass: SettlementRepository,
    },
    {
      provide: 'USER_REPOSITORY',
      useClass: UserRepository,
    },
    {
      provide: 'BLACKLISTED_TOKEN_REPOSITORY',
      useClass: BlacklistedTokenRepository,
    },
    {
      provide: 'CONTAMINATED_POINT_REPOSITORY',
      useClass: ContaminatedPointRepository,
    },
  ],
  exports: [
    'CLEANUP_EVENT_REPOSITORY',
    'BASE_OVERPASS_REPOSITORY',
    'OVERPASS_REPOSITORY',
    'OTP_REPOSITORY',
    'REGION_REPOSITORY',
    'SETTLEMENT_REPOSITORY',
    'USER_REPOSITORY',
    'BLACKLISTED_TOKEN_REPOSITORY',
    'CONTAMINATED_POINT_REPOSITORY',
    RedisService,
    PrismaService,
  ],
})
export class DatabaseModule {}
