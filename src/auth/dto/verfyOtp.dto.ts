import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { otpTypeEnum } from '../enum/otpType.enum';

export class verfyOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  destination: string;

  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    enum: otpTypeEnum,
    example: [otpTypeEnum.EMAIL, otpTypeEnum.SMS],
  })
  @IsNotEmpty()
  type: otpTypeEnum;
}
