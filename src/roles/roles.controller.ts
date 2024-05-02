import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { assignPermissionToRoleDto } from './dto/assignPermissionToRole';
import { Permissions } from 'src/permissions/permission.decorator';
import { ErolePermissions } from './roles.modulePermissions';

// todo fix http responses

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Permissions([{ module: 'permission', action: ErolePermissions.create }])
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.create(createRoleDto);
  }

  @Permissions([{ module: 'permission', action: ErolePermissions.read }])
  @Get()
  async findAll() {
    return await this.rolesService.findAll();
  }

  @Permissions([{ module: 'permission', action: ErolePermissions.read }])
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.rolesService.findOneBy({ id });
  }

  @Permissions([{ module: 'permission', action: ErolePermissions.read }])
  @Get('/getByName/:name')
  async findOneByName(@Param('name') name: string) {
    return await this.rolesService.findOneBy({ name });
  }

  @Permissions([{ module: 'permission', action: ErolePermissions.edit }])
  @Patch()
  async update(@Body() updateRoleDto: UpdateRoleDto) {
    if (updateRoleDto.userId) {
      delete updateRoleDto.userId;
    }
    return await this.rolesService.update(updateRoleDto);
  }

  @Permissions([{ module: 'permission', action: ErolePermissions.edit }])
  @Patch('assign-permissions-to-role')
  async assignPermissionsToRole(@Body() role: assignPermissionToRoleDto) {
    return await this.rolesService.assignPermissonToRole(role);
  }

  @Permissions([{ module: 'permission', action: ErolePermissions.delete }])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.rolesService.remove(+id);
  }
}
