import { Test, TestingModule } from '@nestjs/testing';
import { CommonServices } from './common-services.service';
import { DataSource } from 'typeorm';
import { AppModule } from 'nest-starter/src/app.module';
import { INestApplication } from '@nestjs/common';
let app: INestApplication;

describe('CommonServicesService', () => {
  let service: CommonServices;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<CommonServices>(CommonServices);
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
