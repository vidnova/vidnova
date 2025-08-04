import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { USE_CASES } from './use-cases';
import { DalModule } from '@ecorally/dal';
import { BullMqService } from '@ecorally/shared';

@Module({
  imports: [DalModule],
  controllers: [MessageController],
  providers: [...USE_CASES, BullMqService],
})
export class MessageModule {}
