import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DataSource } from 'typeorm';
import { AppModule } from 'nest-starter/src/app.module';
import { INestApplication } from '@nestjs/common';
let app: INestApplication;

describe('UsersService', () => {
  let service: UsersService;
  let dataSource: DataSource;
  const testUser: CreateUserDto = {
    firstName: 'test user name',
    lastName: 'test user last name',
    email: 'test@user.email',
    password: '123456789',
  };
  const updateTestUser = {
    email: 'updatedEmail@test.test',
  };
  let createdUser = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
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

  it('should create a user', async () => {
    createdUser = await service.create(testUser);
    const findedUser = await service.findOneBy({ email: testUser.email });
    expect(findedUser.email).toBe(testUser.email);
  });

  it('should update a user', async () => {
    await service.update({
      id: createdUser.id,
      ...updateTestUser,
    });
    const findedUser = await service.findOneBy({ email: updateTestUser.email });
    expect(findedUser.email).toBe(updateTestUser.email);
  });

  it('should delete a user', async () => {
    await service.remove(createdUser.id);
    const findedUser = await service.findOneBy({ email: updateTestUser.email });
    expect(findedUser).toBe(null);
  });
});
