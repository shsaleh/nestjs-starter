import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class assignRoleToUserDto {
  @ApiProperty()
  @IsNumber()
  user_id: number;

  @ApiProperty()
  @IsNumber()
  role_id: number;
}
