import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleProviders } from './entities/role.providers';
import { DatabaseModule } from 'nest-starter/src/db/db.module';
import { PermissionsModule } from 'nest-starter/src/permissions/permissions.module';

@Module({
  imports: [DatabaseModule, PermissionsModule],
  controllers: [RolesController],
  providers: [RolesService, ...RoleProviders],
  exports: [RolesService],
})
export class RolesModule {}
