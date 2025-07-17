import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { USE_CASES } from './use-cases';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [...USE_CASES],
})
export class UserModule {}
