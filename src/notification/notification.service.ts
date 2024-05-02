import { Inject, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: Partial<CreateNotificationDto>) {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    return await this.notificationRepository.save(notification);
  }

  async send(createNotificationDto: Partial<CreateNotificationDto>) {
    // Assuming sending involves creating a notification as well
    const notification = await this.create(createNotificationDto);
    // Add logic to send the notification
    return `Notification #${notification.id} sent`;
  }

  async findAll() {
    return this.notificationRepository.find();
  }

  async findOne(id: number) {
    return this.notificationRepository.findOneBy({ id });
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    await this.notificationRepository.update(id, updateNotificationDto);
    return this.notificationRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.notificationRepository.delete(id);
  }
}
