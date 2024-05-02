import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class assignPermissionToRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  role_id: number;

  @ApiProperty({ example: [1] })
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  permissionId?: Array<number>;
}
