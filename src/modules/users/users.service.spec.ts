import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Profile } from './type/profile.type';
import { RequestUser } from '../auth/type/req.interface';
import { UpdateUserInfoDTO } from './dto/user.dto';

const mockUser: Profile = {
  id: 1,
  userName: 'TestUser',
  imageUrl: 'test-image.jpg',
  follow: false,
};

class UsersServiceMock {
  async findUserById(friendId: number, userId: number) {
    return mockUser;
  }
  async updateUserInfo(userId: number, updateUserInfoDTO: UpdateUserInfoDTO) {
    return null;
  }
}

class UsersRepositoryMock {
  async findUserById(userId: number) {
    return mockUser;
  }
  async isfollowing(friendId: number, userId: number) {
    return true;
  }
  async updateUserInfo(userId: number, updateUserInfoDTO: UpdateUserInfoDTO) {
    return {
      ...updateUserInfoDTO,
      id: userId,
    };
  }
}

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;
  let req: RequestUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useClass: UsersServiceMock,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);

    req = {
      user: {
        id: 1,
        region: { id: 1 },
      },
    } as RequestUser;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findUserById', () => {
    it('should return a user profile', async () => {
      const friendId = 2;

      jest.spyOn(userService, 'findUserById').mockResolvedValue(mockUser);

      const result = await controller.findUserById(req, friendId);

      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUserInfo', () => {
    it('should call UsersService updateUserInfo and return the result', async () => {
      const updateUserInfoDTO: UpdateUserInfoDTO = {
        userName: 'hi',
        phoneNumber: '011-2234-3113',
        region: 1,
        role: 'ch',
        imageUrl: null,
      };

      const expectedResult: any = {
        userName: 'hi',
        phoneNumber: '011-2234-3113',
        region: 1,
        role: 'ch',
        imageUrl: null,
        id: 1,
      };

      jest
        .spyOn(userService, 'updateUserInfo')
        .mockResolvedValue(expectedResult);

      const result = await controller.updateUserInfo(req, updateUserInfoDTO);

      expect(userService.updateUserInfo).toHaveBeenCalledWith(
        req.user.id,
        updateUserInfoDTO,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
