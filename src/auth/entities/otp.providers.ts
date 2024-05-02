import { DataSource } from 'typeorm';
import { Otp } from './Otp.entity';

export const OtpProviders = [
  {
    provide: 'OTP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Otp),
    inject: ['DATA_SOURCE'],
  },
];
