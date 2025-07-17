import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { MailModule } from './mail/mail.module';
import { CleanupEventModule } from './cleanup-event/cleanup-event.module';
import { SettlementModule } from './settlement/settlement.module';
import { RegionModule } from './region/region.module';
import { DatabaseModule } from './database/database.module';
import { ContaminatedPointModule } from './contaminated-point/contaminated-point.module';
import { CommentModule } from './comment/comment.module';
import { TakePartModule } from './take-part/take-part.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    OtpModule,
    MailModule,
    CleanupEventModule,
    SettlementModule,
    RegionModule,
    DatabaseModule,
    ContaminatedPointModule,
    CommentModule,
    TakePartModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
