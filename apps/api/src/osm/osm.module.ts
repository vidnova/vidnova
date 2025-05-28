import { Module } from '@nestjs/common';
import { OsmService } from './osm.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [OsmService],
  exports: [OsmService],
})
export class OsmModule {}
