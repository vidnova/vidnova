import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { USE_CASES } from './use-cases';

@Module({
  controllers: [UserController],
  providers: [...USE_CASES],
})
export class UserModule {}
