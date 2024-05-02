import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsBoolean()
  @IsOptional()
  isEmailVerfied?: boolean = false;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mobile?: string;

  @IsBoolean()
  @IsOptional()
  isMobileVerfied?: boolean = false;

  @IsNumber()
  @IsOptional()
  planId?: number;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;
}
