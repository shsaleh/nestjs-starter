import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModulesService } from './module.service';
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from './permission.decorator';
import { EmodulePermissions } from './module.modulePermissions';

// todo fix http responses

@ApiTags('permission module')
@Controller('permission-modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Permissions([{ module: 'permission', action: EmodulePermissions.create }])
  @Post()
  async create(@Body() createModuleDto: CreateModuleDto) {
    return await this.modulesService.create(createModuleDto);
  }

  @Permissions([{ module: 'permission', action: EmodulePermissions.read }])
  @Get()
  async findAll() {
    return await this.modulesService.findAll();
  }

  @Permissions([{ module: 'permission', action: EmodulePermissions.read }])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.modulesService.findOne(+id);
  }

  @Permissions([{ module: 'permission', action: EmodulePermissions.edit }])
  @Patch()
  async update(@Body() updateModuleDto: UpdateModuleDto) {
    return await this.modulesService.update(updateModuleDto);
  }

  @Permissions([{ module: 'permission', action: EmodulePermissions.delete }])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.modulesService.remove(+id);
  }
}
