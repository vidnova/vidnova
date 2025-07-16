import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { USE_CASES } from './use-cases';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...USE_CASES],
  controllers: [CommentController],
  exports: [...USE_CASES],
})
export class CommentModule {}
