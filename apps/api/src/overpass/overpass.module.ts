import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { OverpassRepositoryImpl } from './infrastructure/repositories/overpass.repository';
import { CachingOverpassRepository } from './infrastructure/cache/caching-overpass-repository';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: 'BASE_OVERPASS_REPOSITORY',
      useClass: OverpassRepositoryImpl,
    },
    {
      provide: 'OVERPASS_REPOSITORY',
      useClass: CachingOverpassRepository,
    },
  ],
  exports: ['OVERPASS_REPOSITORY'],
})
export class OverpassModule {}
