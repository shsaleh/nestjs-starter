import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Role } from './entities/role.entity';
import { getTestModule } from 'test/testingModule';

describe('RolesController', () => {
  let app: INestApplication;
  let role: Role;
  let requestIns;
  beforeAll(async () => {
    const test = await getTestModule();
    app = test.app;
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

  it('should create new role', async () => {
    await requestIns
      .post('/roles')
      .send({ name: 'test' })
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.CREATED);
        role = res.body;
      });
  });

  it('should duplicated error', async () => {
    await requestIns
      .post('/roles')
      .send({ name: 'test' })
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.CONFLICT);
      });
  });

  it('should update created role', async () => {
    await requestIns
      .patch('/roles')
      .send({ id: role.id, name: 'updatedRole' })
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.OK);
      });
  });

  it('should get created role', async () => {
    await requestIns
      .get('/roles/' + role.id)
      .send()
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.OK);
        expect(res.body.name).toBe('updatedRole');
      });
  });

  it('should delete created role', async () => {
    await requestIns
      .delete('/roles/' + role.id)
      .send()
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.OK);
      });
  });
});
