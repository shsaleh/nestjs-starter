import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'nest-starter/src/app.module';
import { DataSource } from 'typeorm';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'nest-starter/src/db/db.module';
import { otpTypeEnum } from './enum/otpType.enum';
let app: INestApplication;

describe('AuthController', () => {
  const user = { mobile: 6464, email: 'asd@adad.ad' };
  let dataSource: DataSource;
  let authService: AuthService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = module.createNestApplication();
    dataSource = app.get<DataSource>('DATA_SOURCE');
    authService = module.get<AuthService>(AuthService);
    await app.init();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      await app.close();
    }
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
