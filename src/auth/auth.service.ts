import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { otpDto } from './dto/OTP.dto';
import { verfyOtpDto } from './dto/verfyOtp.dto';
import { Repository } from 'typeorm';
import { getRandomInt } from 'src/helpers';
import { Otp } from './entities/Otp.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtBlackList } from './entities/jwtBlackList.entity';
import { otpTypeEnum } from './enum/otpType.enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly user: UsersService,
    private jwtService: JwtService,
    @Inject('OTP_REPOSITORY')
    private readonly otpRepository: Repository<Otp>,
    @Inject('JWT_BLACK_LIST_REPOSITORY')
    private readonly jwtBlackListRepository: Repository<JwtBlackList>,
  ) {}

  async sendOtp(otp: otpDto) {
    const { type, destination } = {
      ...otp,
      type: otp.type.toLocaleUpperCase() as otpTypeEnum,
    };
    const code = process.env.otp_test_code
      ? process.env.otp_test_code
      : getRandomInt(5).toString();

    const savedOtp = await this.otpRepository.save({ ...otp, code });

    if (!savedOtp) {
      throw new Error("can't save otp to DB");
    }
    const findBy =
      type.toLocaleUpperCase() == otpTypeEnum.SMS ? 'mobile' : 'email';
    const user = await this.user.findOneBy(
      {
        [findBy]: destination,
      },
      { relations: ['Roles'] },
    );
    if (!process.env.otp_test_code) {
      return this.notificationService.send({
        type,
        destination,
        content: code,
        userId: user?.id ? user.id : null,
      });
    }
  }

  async verfyOtp({ destination, code, type }: verfyOtpDto) {
    const findBy =
      type.toLocaleUpperCase() == otpTypeEnum.SMS ? 'mobile' : 'email';
    const otp = await this.otpRepository.findOneBy({
      destination,
      code,
      isValid: true,
    });
    let user: User;

    if (!process.env.otp_expiration_time) {
      throw new Error('otp_expiration_time must be defined in env file');
    }

    if (!otp) {
      throw new UnauthorizedException();
    }

    const otpCreatedTime = new Date(otp.createdAt).getTime();

    const otpExpireTime = new Date(
      parseInt(process.env.otp_expiration_time) * 60 * 1000,
    ).getTime();

    const isOtpExpire = otpCreatedTime < otpExpireTime || !otp.isValid;

    if (isOtpExpire) {
      throw new UnauthorizedException();
    }

    user = await this.user.findOneBy(
      {
        [findBy]: destination,
      },
      { relations: ['Roles'] },
    );
    if (!user) {
      user = await this.user.create({ [findBy]: destination });
    }

    otp.isValid = false;
    this.otpRepository.update(otp.id, otp);

    const payload = { sub: user.id, roles: user.Roles };
    return { access_token: await this.jwtService.signAsync(payload), user };
  }

  async logout(jwtToken: string) {
    const isTokenAleardyBlackListed =
      await this.jwtBlackListRepository.findOneBy({
        jwtToken,
      });

    if (isTokenAleardyBlackListed) {
      throw new BadRequestException('the jwt token is already invalidated');
    }

    const expireAt = new Date(
      parseInt(this.jwtService.decode(jwtToken).exp) * 1000,
    );

    const res = await this.jwtBlackListRepository.save({ jwtToken, expireAt });
    return res;
  }
}
