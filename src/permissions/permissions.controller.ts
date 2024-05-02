import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags } from '@nestjs/swagger';
import { EpermissionPermissions } from './permission.modulePermissions';
import { Permissions } from './permission.decorator';

// todo fix http responses

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Permissions([{ module: 'permission', action: EpermissionPermissions.edit }])
  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionsService.create(createPermissionDto);
  }

  @Permissions([{ module: 'permission', action: EpermissionPermissions.read }])
  @Get()
  async findAll() {
    return await this.permissionsService.findAll();
  }
  @Permissions([{ module: 'permission', action: EpermissionPermissions.read }])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.permissionsService.findOne(+id);
  }

  @Permissions([{ module: 'permission', action: EpermissionPermissions.edit }])
  @Patch()
  async update(@Body() updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionsService.update(updatePermissionDto);
  }

  @Permissions([
    { module: 'permission', action: EpermissionPermissions.delete },
  ])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.permissionsService.remove(+id);
  }
}
