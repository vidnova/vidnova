import { Global, Module } from '@nestjs/common';
import { AuthService, RedisService } from './services';

@Global()
@Module({
  providers: [AuthService, RedisService],
  exports: [AuthService, RedisService],
})
export class SharedModule {}
