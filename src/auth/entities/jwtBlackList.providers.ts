import { DataSource } from 'typeorm';
import { JwtBlackList } from './jwtBlackList.entity';

export const JwtBlackListProviders = [
  {
    provide: 'JWT_BLACK_LIST_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(JwtBlackList),
    inject: ['DATA_SOURCE'],
  },
];
