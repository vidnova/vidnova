import { Module } from '@nestjs/common';
import { OverpassService } from './overpass.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [OverpassService],
  exports: [OverpassService],
})
export class OverpassModule {}
