import { TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { getTestModule } from 'test/testingModule';

describe('UsersService', () => {
  let service: UsersService;
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
    const test = await getTestModule();
    const module: TestingModule = test.module;
    service = module.get<UsersService>(UsersService);
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
