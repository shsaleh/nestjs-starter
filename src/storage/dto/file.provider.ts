import { DataSource } from 'typeorm';
import { File } from '../entities/file.entity';

export const FileProviders = [
  {
    provide: 'File_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(File),
    inject: ['DATA_SOURCE'],
  },
];
