import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from './auth.service';
import { otpTypeEnum } from './enum/otpType.enum';
import { getTestModule } from 'test/testingModule';
let app: INestApplication;

describe('AuthController', () => {
  const user = { mobile: process.env.admin_mobile, email: 'asd@adad.ad' };
  let authService: AuthService;
  beforeAll(async () => {
    const test = await getTestModule();

    app = test.app;
    authService = test.module.get<AuthService>(AuthService);
    await app.init();
  });

  it('should save and send a otp code / type sms', async () => {
    await request(app.getHttpServer())
      .post('/auth/sendotp')
      .send({ destination: user.mobile, type: 'SMS' })
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.CREATED);
      });

    const isVerfyed = await authService.verfyOtp({
      destination: user.mobile.toString(),
      type: otpTypeEnum.SMS,
      code: process.env.otp_test_code,
    });

    expect(isVerfyed).toBeTruthy();
  });

  it('should save and send a otp code / type sms and verfy it', async () => {
    await request(app.getHttpServer())
      .post('/auth/sendotp')
      .send({ destination: user.mobile, type: 'SMS' })
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.CREATED);
      });

    await request(app.getHttpServer())
      .post('/auth/sendotp')
      .send({
        destination: user.mobile.toString(),
        type: 'SMS',
        code: process.env.otp_test_code,
      })
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.CREATED);
      });
  });
});
