import { DataSource } from 'typeorm';
import { Permission } from './permission.entity';

export const PermissionProviders = [
  {
    provide: 'PERMISSION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Permission),
    inject: ['DATA_SOURCE'],
  },
];
