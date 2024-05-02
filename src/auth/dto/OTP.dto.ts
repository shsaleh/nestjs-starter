import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { otpTypeEnum } from '../enum/otpType.enum';

export class otpDto {
  @ApiProperty({
    enum: otpTypeEnum,
  })
  @IsNotEmpty()
  type: otpTypeEnum;

  @ApiProperty()
  @IsNotEmpty()
  destination: string;
}
