import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegionModule } from './region/region.module';
import { SettlementModule } from './settlement/settlement.module';

@Module({
  imports: [RegionModule, SettlementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
