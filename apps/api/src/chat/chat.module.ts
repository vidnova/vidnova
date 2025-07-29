import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { USE_CASES } from './use-cases';

@Module({
  controllers: [ChatController],
  providers: [...USE_CASES],
})
export class ChatModule {}
