import { DataSource } from 'typeorm';
import { Module } from './module.entity';

export const ModuleProviders = [
  {
    provide: 'MODULE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Module),
    inject: ['DATA_SOURCE'],
  },
];
