import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProviders } from './entities/user.providers';
import { CommonServicesModule } from 'src/common-services/common-services.module';
import { DatabaseModule } from 'src/db/db.module';
import { NotificationModule } from 'src/notification/notification.module';
import { RolesModule } from 'src/roles/roles.module';

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
