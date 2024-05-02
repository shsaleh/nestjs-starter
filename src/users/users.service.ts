import {
  Injectable,
  Inject,
  OnModuleInit,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CommonServices } from 'src/common-services/common-services.service';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
import { NotificationService } from 'src/notification/notification.service';
import { RolesService } from 'src/roles/roles.service';

const admin = {
  email: 'admin@personalPlanner.com',
};
@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly user: Repository<User>,
    private readonly commonServices: CommonServices,
    private readonly notificationService: NotificationService,
    private readonly roleService: RolesService,
  ) {}
  async onModuleInit() {
    let findedUser = await this.findOneBy({ email: admin.email });
    if (!findedUser) {
      await this.create({
        email: admin.email,
        firstName: 'admin',
        lastName: 'admin',
        isEmailVerfied: false,
        isMobileVerfied: false,
        mobile: process.env.admin_mobile,
        planId: null,
        profileImage: null,
        password: await bcrypt.hash('123456', process.env.SALT),
      })
        .then(async (res) => {
          findedUser = res;
          const role = await this.roleService.findOneBy({ name: 'admin' });
          this.assignRoleToUser(role.id, findedUser.id);
          console.log('admin created');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  async create(createUserDto: CreateUserDto) {
    await this.commonServices.checkForDuplicateFields(this.user, [
      { field: 'email', value: createUserDto.email },
      { field: 'mobile', value: createUserDto.mobile },
    ]);
    return await this.user.save(createUserDto);
  }

  async assignRoleToUser(roleId: number, userId: number) {
    const user = await this.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('the user not found');
    }
    const role = await this.roleService.findOneBy({ id: roleId });
    if (!role) {
      throw new NotFoundException('the role not found');
    }
    user.Roles = [role];
    return await this.user.save(user);
  }

  async createNotification(notification: CreateNotificationDto) {
    let user;
    if (notification.userId) {
      user = await this.findOneBy({ id: notification.userId });
      if (!user) {
        throw new BadRequestException('the user not found');
      }
      notification.userId = user.id;
    }
    return await this.notificationService.create(notification);
  }

  async findAll(page: number = 1, limit: number = 10) {
    limit = limit > 100 ? 100 : limit;
    const offset = (page - 1) * limit;

    return await this.user.find({
      skip: offset,
      take: limit,
    });
  }

  async findOneBy(user: Partial<User>, where: FindOneOptions<User> = {}) {
    return await this.user.findOne({ where: { ...user }, ...where });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.user.update({ id: updateUserDto.id }, updateUserDto);
  }

  async remove(id: number) {
    return await this.user.delete({ id: id });
  }
}
