import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from 'nest-starter/src/permissions/permission.decorator';
import { EnotificationPermissions } from './notification.modulePermissions';
// todo fix http responses
@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Permissions([
    { module: 'permission', action: EnotificationPermissions.create },
  ])
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Permissions([
    { module: 'permission', action: EnotificationPermissions.read },
  ])
  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Permissions([
    { module: 'permission', action: EnotificationPermissions.read },
  ])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Permissions([
    { module: 'permission', action: EnotificationPermissions.edit },
  ])
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Permissions([
    { module: 'permission', action: EnotificationPermissions.delete },
  ])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
