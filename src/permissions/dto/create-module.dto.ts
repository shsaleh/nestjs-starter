import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateModuleDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
