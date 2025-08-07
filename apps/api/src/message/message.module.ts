import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { USE_CASES } from './use-cases';
import { DalModule } from '@vidnova/dal';
import { BullMqService } from '@vidnova/shared';

@Module({
  imports: [DalModule],
  controllers: [MessageController],
  providers: [...USE_CASES, BullMqService],
})
export class MessageModule {}
