import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { ModulesService } from './module.service';
import { ModulesController } from './modules.controller';
import { PermissionProviders } from './entities/permission.providers';
import { ModuleProviders } from './entities/module.providers';
import { DatabaseModule } from 'src/db/db.module';
import { PermissionsImporterService } from './modulePermissionImporter.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PermissionsController, ModulesController],
  providers: [
    ...ModuleProviders,
    ...PermissionProviders,
    ModulesService,
    PermissionsService,
    PermissionsImporterService,
  ],
  exports: [PermissionsService],
})
export class PermissionsModule {}
