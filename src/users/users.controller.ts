import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateNotificationDto } from 'nest-starter/src/notification/dto/create-notification.dto';
import { assignRoleToUserDto } from './dto/assignRoleToUser.dto';
import { Permissions } from 'nest-starter/src/permissions/permission.decorator';
import { EuserPermissions } from './user.modulePermissions';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permissions([{ module: 'user', action: EuserPermissions.create }])
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return await this.usersService
      .create(createUserDto)
      .then((user) => {
        res.status(HttpStatus.CREATED).json(user);
      })
      .catch((error) => {
        res.status(error.status).json(error);
      });
  }

  @Permissions([{ module: 'user', action: EuserPermissions.edit }])
  @Post('createNotification')
  async createNotification(
    @Body() notification: CreateNotificationDto,
    @Res() res: Response,
  ) {
    return await this.usersService
      .createNotification(notification)
      .then((createdNotification) => {
        res.status(HttpStatus.CREATED).json(createdNotification);
      })
      .catch((error) => {
        res.status(error.status).json(error);
      });
  }

  @Permissions([{ module: 'user', action: EuserPermissions.edit }])
  @Patch('assign-role-to-user')
  @ApiBody({ type: assignRoleToUserDto })
  async assignRoleToUser(
    @Body() { role_id, user_id }: assignRoleToUserDto,
    @Res() res: Response,
  ) {
    return await this.usersService
      .assignRoleToUser(role_id, user_id)
      .then((role) => {
        res.status(HttpStatus.OK).json(role);
      });
  }

  @Permissions([{ module: 'user', action: EuserPermissions.read }])
  @Get('')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  async findAll(
    @Res() res: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.usersService.findAll(page, limit).then((users) => {
      res.status(HttpStatus.OK).json(users);
    });
  }

  @Permissions([{ module: 'user', action: EuserPermissions.read }])
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    return await this.usersService.findOneBy({ id: id }).then((user) => {
      res.status(HttpStatus.OK).json(user);
    });
  }

  @Permissions([{ module: 'user', action: EuserPermissions.edit }])
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    return await this.usersService.update(updateUserDto).then((user) => {
      res.status(HttpStatus.OK).json(user);
    });
  }

  @Permissions([{ module: 'user', action: EuserPermissions.delete }])
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    return await this.usersService.remove(+id).then(() => {
      res.status(HttpStatus.NO_CONTENT).json();
    });
  }
}
