import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/roles/entities/role.entity';
import { getTestModule } from 'test/testingModule';

describe('UsersController', () => {
  let app: INestApplication;
  const testUser: CreateUserDto = {
    firstName: 'user controller test user name',
    lastName: 'user controllertest user last name',
    email: 'usercontrollertest@user.email',
    password: '123456789',
  };
  const updateEmail = 'updatedUsercontrollertest@user.email';
  let createdUser: UpdateUserDto;
  let requestIns;
  beforeAll(async () => {
    const test = await getTestModule();
    app = test.app;
    await request(app.getHttpServer())
      .post('/auth/sendotp')
      .send({ destination: process.env.admin_mobile, type: 'SMS' });
    const res = await request(app.getHttpServer()).post(`/auth/verfyOtp`).send({
      code: process.env.otp_test_code,
      destination: process.env.admin_mobile,
      type: 'sms',
    });

    if (!res.error) {
      requestIns = request.agent(app.getHttpServer()).set({
        authorization: 'Bearer ' + res.body.access_token,
      });
    }
  });

  it('should create a user /users (post)', () => {
    return requestIns
      .post('/users')
      .send(testUser)
      .expect(HttpStatus.CREATED)
      .expect((response) => {
        createdUser = response.body;
        expect(response.body).toEqual(expect.objectContaining(testUser));
      });
  });

  it('should duplicate error on create a user /users (post)', () => {
    return requestIns
      .post('/users')
      .send(testUser)
      .expect(HttpStatus.CONFLICT)
      .expect((error) => {
        expect(error.body).toEqual(expect.objectContaining({ status: 409 }));
        expect(error.body.response).toEqual(
          expect.objectContaining({
            message: 'Duplicate entry',
            fields: '["email"]',
          }),
        );
      });
  });

  it('should update a user /users (patch)', () => {
    return requestIns
      .patch('/users')
      .send({ id: createdUser.id, email: updateEmail })
      .expect(HttpStatus.OK);
  });

  it('check updated user /users/:id (get)', () => {
    return requestIns.get('/users/' + createdUser.id).expect((response) => {
      expect(response.body).toEqual(
        expect.objectContaining({ email: updateEmail }),
      );
    });
  });

  it('should assign a role to created user ', async () => {
    const role: Role = await requestIns.get('/roles/getByName/admin');
    return requestIns
      .patch('/users/assign-role-to-user')
      .send({
        user_id: createdUser.id,
        role_id: role.id,
      })
      .expect((response) => {
        expect(response.body.Roles[0]).toEqual(
          expect.objectContaining({ name: 'admin' }),
        );
      });
  });

  it('should delete a user /users (delete)', () => {
    return requestIns
      .delete('/users/' + createdUser.id)
      .expect(HttpStatus.NO_CONTENT);
  });
});
