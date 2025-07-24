import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { USE_CASES } from './use-cases';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ChatController],
  providers: [...USE_CASES],
})
export class ChatModule {}
