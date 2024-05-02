import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CommonServices } from 'src/common-services/common-services.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { assignPermissionToRoleDto } from './dto/assignPermissionToRole';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: Repository<Role>,
    private readonly commonService: CommonServices,
    private readonly permissionService: PermissionsService,
  ) {}

  async onModuleInit() {
    let adminRole = await this.roleRepository.findOneBy({ name: 'admin' });

    if (!adminRole) {
      await this.create({ name: 'admin' }).then(async (createdAdminRole) => {
        console.log('admin role created');
        adminRole = createdAdminRole;
      });
    }
    await this.permissionService
      .findAll()
      .then((permissions) => {
        const permissonsId = permissions.map((per) => per.id);
        this.assignPermissonToRole({
          role_id: adminRole.id,
          permissionId: permissonsId,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async create(createRoleDto: CreateRoleDto) {
    await this.commonService.checkForDuplicateFields(this.roleRepository, [
      { field: 'name', value: createRoleDto.name },
    ]);
    return await this.roleRepository.save(createRoleDto);
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async findOneBy(role: Partial<Role>) {
    return await this.roleRepository.findOneBy(role);
  }

  async update(updateRoleDto: UpdateRoleDto) {
    const role = await this.findOneBy({ id: updateRoleDto.id });

    if (!role) {
      throw new NotFoundException('the role not found');
    }

    return await this.roleRepository.update(
      { id: updateRoleDto.id },
      updateRoleDto,
    );
  }
  async assignPermissonToRole(assignRoleDto: assignPermissionToRoleDto) {
    const permissions = await this.permissionService.findAll({
      where: { id: In(assignRoleDto.permissionId) },
    });

    if (permissions.length < assignRoleDto.permissionId.length) {
      throw new NotFoundException(
        'can not find these permissions (' +
          assignRoleDto.permissionId.filter(
            (PID) => !permissions.find((perm) => perm.id === PID),
          ) +
          ')',
      );
    }

    const role = await this.roleRepository.findOneBy({
      id: assignRoleDto.role_id,
    });

    if (!role) {
      throw new NotFoundException('the role not found');
    }

    role.permissions = permissions;

    return await this.roleRepository.save(role);
  }

  async remove(id: number) {
    return await this.roleRepository.delete(id);
  }
}
