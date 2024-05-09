import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import * as fs from 'fs';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { ModulesService } from './module.service';
import { CommonServices } from 'src/common-services/common-services.service';
import * as path from 'path';
import { ImodulePermissions } from './interface/modulePermissions';
import { Module } from './entities/module.entity';

@Injectable()
export class PermissionsImporterService implements OnModuleInit {
  private readonly permissions: Permission[] = [];
  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private readonly permissionRepository: Repository<Permission>,
    private readonly module: ModulesService,
    private readonly commonService: CommonServices,
    @Inject('MODULE_REPOSITORY')
    private readonly moduleRepository: Repository<Module>,
  ) {}
  async onModuleInit() {
    await this.importClassesFromDirectory(
      path.resolve() + (process.env.NODE_ENV == 'test' ? '/src' : '/dist/src'),
    );
  }

  async create(createPermissionDto: CreatePermissionDto) {
    await this.commonService.checkForDuplicateFields(
      this.permissionRepository,
      [{ field: 'action', value: createPermissionDto.action }],
    );
    const findedModule = await this.module.findOne(
      createPermissionDto.moduleId,
    );

    if (!findedModule) {
      throw new NotFoundException('module not found');
    }
    const permission = this.permissionRepository.create(createPermissionDto);
    permission.module = findedModule;

    return await this.permissionRepository.save(permission);
  }

  // Function to import all classes from TypeScript files in a directory
  async importClassesFromDirectory(dir: string): Promise<void> {
    // Read all files and directories within the given directory
    const items = fs.readdirSync(dir, { withFileTypes: true });

    // Loop through each item in the directory
    for (const item of items) {
      // Construct the full path of the current item
      const fullPath = path.resolve(dir, item.name);

      // Check if the item is a directory
      if (item.isDirectory()) {
        // Recursively import classes from the subdirectory
        await this.importClassesFromDirectory(fullPath);
      } else if (
        item.isFile() &&
        item.name.includes('.modulePermissions') &&
        (process.env.NODE_ENV == 'test'
          ? item.name.endsWith('.ts')
          : item.name.endsWith('.js'))
      ) {
        // Import the TypeScript file if it ends with .ts
        try {
          const Module = (await import(fullPath)) as ImodulePermissions;

          console.log(`Module permissions imported from ${fullPath}`);

          const instance = new Module['default']() as ImodulePermissions;

          let PermissionModule = await this.moduleRepository.findOneBy({
            name: instance.module,
          });

          if (!PermissionModule) {
            PermissionModule = await this.moduleRepository.save({
              name: instance.module,
            });
          }

          const permissons = instance.actions.map(async (item) => {
            return await this.permissionRepository.create({
              action: item,
              moduleId: PermissionModule.id,
            });
          });

          Promise.all(permissons).then(async (res) => {
            res.forEach((item) => {
              this.permissionRepository.upsert(item, {
                conflictPaths: ['action', 'moduleId'],
                skipUpdateIfNoValuesChanged: true,
              });
            });
          });
        } catch (error) {
          console.error(`Error importing ${fullPath}:`, error);
        }
      }
    }
  }
}
