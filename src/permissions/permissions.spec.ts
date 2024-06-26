import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app.module';
import { Permission } from './entities/permission.entity';
import * as request from 'supertest';
import { Module } from './entities/module.entity';

describe('PermissionsController', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let permission: Permission;
  let permissionModule: Module;
  let requestIns;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    dataSource = app.get<DataSource>('DATA_SOURCE');
    await app.init();
    await request(app.getHttpServer())
      .post('/auth/sendotp')
      .send({ destination: process.env.admin_mobile, type: 'SMS' });

    const res = await request(app.getHttpServer()).get(
      `/auth/verfyOtp/${process.env.otp_test_code}/${process.env.admin_mobile}/sms`,
    );

    if (!res.error) {
      requestIns = request.agent(app.getHttpServer()).set({
        authorization: 'Bearer ' + res.body.access_token,
      });
    }
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      await app.close();
    }
  });

  it('should create permission module', async () => {
    await requestIns
      .post('/permission-modules')
      .send({ name: 'user-test' } as Module)
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.CREATED);
        permissionModule = res.body;
      });
  });
  it('should create permission', async () => {
    await requestIns
      .post('/permissions')
      .send({ action: 'readTest', moduleId: permissionModule.id } as Permission)
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.CREATED);
        permission = res.body;
      });
  });

  it('should update created permission', async () => {
    await requestIns
      .patch('/permissions')
      .send({ id: permission.id, action: 'updatedReadTest' } as Permission)
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.OK);
      });
  });

  it('should get created permission', async () => {
    await requestIns
      .get('/permissions/' + permission.id)
      .send()
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.OK);
        expect((res.body as Permission).action).toBe('updatedReadTest');
      });
  });

  it('should update created permission module', async () => {
    await requestIns
      .patch('/permission-modules')
      .send({
        id: permissionModule.id,
        name: 'updatedUser',
      } as Module)
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.OK);
      });
  });

  it('should get created permission module', async () => {
    await requestIns
      .get('/permission-modules/' + permissionModule.id)
      .send()
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.OK);
        expect((res.body as Module).name).toBe('updatedUser');
      });
  });

  it('should delete created permission', async () => {
    await requestIns
      .delete('/permissions/' + permission.id)
      .send()
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.OK);
      });
  });

  it('should delete created permission module', async () => {
    await requestIns
      .delete('/permission-modules/' + permissionModule.id)
      .send()
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.OK);
      });
  });
});
