import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
let app: INestApplication;

describe('AppController', () => {
  let appController: AppController;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    appController = module.get<AppController>(AppController);
    dataSource = module.get<DataSource>('DATA_SOURCE');
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      await app.close();
    }
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
