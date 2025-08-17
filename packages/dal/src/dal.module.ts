import { Global, Module } from '@nestjs/common';
import {
  BlacklistedTokenRepository,
  CachingOverpassRepository,
  ChatRepository,
  CleanupEventRepository,
  CommentRepository,
  ContaminatedPointRepository,
  OtpRepository,
  OverpassRepository,
  PrismaService,
  RegionRepository,
  ReportRepository,
  SettlementRepository,
  TakePartRepository,
  UserRepository,
} from './repositories';
import { MessageRepository } from './repositories';

@Global()
@Module({
  providers: [
    PrismaService,
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
    {
      provide: 'COMMENT_REPOSITORY',
      useClass: CommentRepository,
    },
    {
      provide: 'TAKE_PART_REPOSITORY',
      useClass: TakePartRepository,
    },
    {
      provide: 'REPORT_REPOSITORY',
      useClass: ReportRepository,
    },
    {
      provide: 'CHAT_REPOSITORY',
      useClass: ChatRepository,
    },
    {
      provide: 'MESSAGE_REPOSITORY',
      useClass: MessageRepository,
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
    'COMMENT_REPOSITORY',
    'TAKE_PART_REPOSITORY',
    'REPORT_REPOSITORY',
    'CHAT_REPOSITORY',
    'MESSAGE_REPOSITORY',
    PrismaService,
  ],
})
export class DalModule {}
