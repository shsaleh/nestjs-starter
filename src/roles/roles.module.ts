import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleProviders } from './entities/role.providers';
import { DatabaseModule } from 'src/db/db.module';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  imports: [DatabaseModule, PermissionsModule],
  controllers: [RolesController],
  providers: [RolesService, ...RoleProviders],
  exports: [RolesService],
})
export class RolesModule {}
