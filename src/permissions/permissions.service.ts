import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { ModulesService } from './module.service';
import { CommonServices } from 'nest-starter/src/common-services/common-services.service';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private readonly permissionRepository: Repository<Permission>,
    private readonly module: ModulesService,
    private readonly commonService: CommonServices,
  ) {}

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

  async findAll(wherecluser?: FindManyOptions) {
    return await this.permissionRepository.find(wherecluser);
  }

  async findOne(id: number) {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException('permission not found');
    }
    return permission;
  }
  async update(updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionRepository.update(
      { id: updatePermissionDto.id },
      updatePermissionDto,
    );
  }

  async remove(id: number) {
    return await this.permissionRepository.delete(id);
  }
}
