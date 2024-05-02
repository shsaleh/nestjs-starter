import { IsOptional } from 'class-validator';
import { notification_type } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  @IsOptional()
  destination?: string;

  @ApiProperty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  @IsOptional()
  icon?: string;

  @ApiProperty()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsOptional()
  type?: notification_type;
}
