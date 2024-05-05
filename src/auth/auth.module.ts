import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NotificationModule } from 'nest-starter/src/notification/notification.module';
import { DatabaseModule } from 'nest-starter/src/db/db.module';
import { OtpProviders } from './entities/Otp.providers';
import { UsersModule } from 'nest-starter/src/users/users.module';
import { JwtBlackListProviders } from './entities/jwtBlackList.providers';

@Module({
  imports: [NotificationModule, DatabaseModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, ...OtpProviders, ...JwtBlackListProviders],
  exports: [...JwtBlackListProviders],
})
export class AuthModule {}
