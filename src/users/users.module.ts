import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProviders } from './entities/user.providers';
import { CommonServicesModule } from 'nest-starter/src/common-services/common-services.module';
import { DatabaseModule } from 'nest-starter/src/db/db.module';
import { NotificationModule } from 'nest-starter/src/notification/notification.module';
import { RolesModule } from 'nest-starter/src/roles/roles.module';

@Module({
  imports: [
    CommonServicesModule,
    DatabaseModule,
    NotificationModule,
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ...UserProviders],
  exports: [UsersService],
})
export class UsersModule {}
