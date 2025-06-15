import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    UserService,
    {
      provide: 'USER_REPOSITORY',
      useClass: UserRepositoryImpl,
    },
  ],
})
export class UserModule {}
