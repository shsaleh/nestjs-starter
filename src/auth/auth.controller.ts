import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { otpDto } from './dto/OTP.dto';
import { verfyOtpDto } from './dto/verfyOtp.dto';
import { Public } from 'nest-starter/src/decorators/public';
import { ApiTags } from '@nestjs/swagger';

// todo fix http responses

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sendOtp')
  sendOtp(@Body() otp: otpDto) {
    // todo need delay for repetitive requests
    return this.authService.sendOtp(otp);
  }

  @Public()
  @Get('verfyOtp/:code/:destination/:type')
  verfyOtp(@Param() params: verfyOtpDto) {
    return this.authService.verfyOtp(params);
  }

  @Public()
  @Post('logout')
  logout(@Headers() { authorization }) {
    if (authorization) {
      return this.authService.logout(authorization);
    }
    throw new BadRequestException('authorization token is invalid');
  }
}
