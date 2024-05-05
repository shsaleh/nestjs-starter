import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CommonServicesModule } from './common-services/common-services.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PermissionsGuard } from './permissions/permission.guard';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ envFilePath: '../.prod.env' }),
    PermissionsModule,
    RolesModule,
    UsersModule,
    CommonServicesModule,
    AuthModule,
    NotificationModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      // privateKey: process.env.PRIVATE_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
