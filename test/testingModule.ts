import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

let cachedModule: {
  module: TestingModule | null;
  app: INestApplication;
  dataSource: DataSource;
} = null;

export async function getTestModule(): Promise<typeof cachedModule> {
  if (!cachedModule) {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app = module.createNestApplication();
    const dataSource = app.get<DataSource>('DATA_SOURCE');
    await app.init();
    cachedModule = { module, app, dataSource };
  }

  return cachedModule;
}
