import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { USER_REPOSITORY } from './tokens/user-repository.token';

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
