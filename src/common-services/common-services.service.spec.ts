import { CommonServices } from './common-services.service';
import { getTestModule } from 'test/testingModule';

describe('CommonServicesService', () => {
  let service: CommonServices;

  beforeAll(async () => {
    const test = await getTestModule();

    service = test.module.get<CommonServices>(CommonServices);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
