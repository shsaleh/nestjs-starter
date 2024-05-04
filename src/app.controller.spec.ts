import { INestApplication } from '@nestjs/common';
import { getTestModule } from 'test/testingModule';
let app: INestApplication;

describe('AppController', () => {
  beforeAll(async () => {
    const test = await getTestModule();
    app = test.app;
    await app.init();
  });

  describe('root', () => {
    it('for test only', () => {
      expect(true);
    });
  });
});
