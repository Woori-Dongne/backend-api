import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserInfoDTO } from './dto/user.dto';

class MockUsersService {
  updateUserInfo = jest.fn();
}

describe('UsersController', () => {
  let controller: UsersController;
  let userService: MockUsersService;
  let req: any;

  beforeEach(async () => {
    userService = new MockUsersService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: userService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    req = {
      user: {
        id: 1,
        region: { id: 1 },
      },
      body: {},
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('saveUserInfo', () => {
    it('should call UsersService saveUserInfo and return the result', async () => {
      const updateUserInfoDTO: UpdateUserInfoDTO = {
        userName: 'hi',
        phoneNumber: '011-2234-3113',
        region: 1,
        role: 'ch',
        imageUrl: null,
      };

      const expectedResult = {
        userName: 'hi',
        phoneNumber: '011-2234-3113',
        region: 1,
        role: 'ch',
        imageUrl: null,
        id: 2,
      };
      userService.updateUserInfo.mockResolvedValue(expectedResult);

      const result = await controller.updateUserInfo(req, updateUserInfoDTO);

      expect(userService.updateUserInfo).toHaveBeenCalledWith(
        1,
        updateUserInfoDTO,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
