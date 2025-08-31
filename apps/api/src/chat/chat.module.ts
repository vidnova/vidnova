import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { USE_CASES } from './use-cases';
import { GetMessagesUseCase } from '../message/use-cases/get-messages/get-messages.use-case';

@Module({
  controllers: [ChatController],
  providers: [...USE_CASES, GetMessagesUseCase],
})
export class ChatModule {}
