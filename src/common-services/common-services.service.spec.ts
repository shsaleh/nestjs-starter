import { CommonServices } from './common-services.service';
import { INestApplication } from '@nestjs/common';
import { getTestModule } from 'test/testingModule';
let app: INestApplication;

describe('CommonServicesService', () => {
  let service: CommonServices;

  beforeAll(async () => {
    const test = await getTestModule();

    service = test.module.get<CommonServices>(CommonServices);
    app = test.app;
    await app.init();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
