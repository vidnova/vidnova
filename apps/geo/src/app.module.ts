import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegionModule } from './region/region.module';
import { SettlementModule } from './settlement/settlement.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { GeoDalModule } from '@vidnova/geo-dal';

@Module({
  imports: [
    RegionModule,
    SettlementModule,
    TypeOrmModule.forRoot({
      ...(databaseConfig as TypeOrmModuleOptions),
      autoLoadEntities: true,
    }),
    GeoDalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
