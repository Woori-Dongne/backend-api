import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserInfoDTO } from './dto/user.dto';
import { RequestUser } from '../auth/type/req.interface';
import { CreateReportDto } from './dto/report.dto';

const mockUser = {
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
    return {
      ...updateUserInfoDTO,
      id: userId,
    };
  }
  async following(data: any) {
    return {
      id: 1,
      user_id: data.userId,
      friend_id: data.friendId,
      created_at: undefined,
    };
  }
  async unfollowing(data: any) {
    return {
      raw: [],
      affected: 1,
    };
  }
}
const mockReport: any = {
  friendId: 2,
  content: 'This is a test report.',
  userId: 1,
  id: 2,
  created_at: null,
};

class MockUsersService {
  findUserById = jest.fn().mockResolvedValue(mockUser);
  updateUserInfo = jest.fn().mockResolvedValue(mockUser);
  createReport = jest.fn().mockResolvedValue(mockReport);
  following = jest.fn().mockResolvedValue({
    id: 1,
    user_id: 1,
    friend_id: 2,
    created_at: undefined,
  });
  unfollowing = jest.fn().mockResolvedValue({
    raw: [],
    affected: 1,
  });
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
          useClass: MockUsersService,
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

      const result = await controller.findUserById(req, friendId);

      expect(result).toEqual(mockUser);
      expect(userService.findUserById).toHaveBeenCalledWith(
        friendId,
        req.user.id,
      );
    });
  });

  describe('updateUserInfo', () => {
    it('should call UsersService updateUserInfo and return the result', async () => {
      const updateUserInfoDTO: UpdateUserInfoDTO = {
        userName: 'hi',
        phoneNumber: '011-2234-3113',
        region: '',
        role: 'ch',
        imageUrl: null,
      };

      const expectedResult: any = {
        ...updateUserInfoDTO,
        id: req.user.id,
      };

      jest
        .spyOn(userService, 'updateUserInfo')
        .mockResolvedValue(expectedResult);

      const result = await controller.updateUserInfo(req, updateUserInfoDTO);

      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('createReport', () => {
    it('should call UsersService createReport and return the result', async () => {
      const createReportDto: CreateReportDto = {
        friendId: 2,
        content: 'This is a test report.',
      };
      const userId = 1;

      const expectedResult = {
        friendId: 2,
        content: 'This is a test report.',
        userId: 1,
        id: 2,
        created_at: null,
      };

      const result = await controller.createReport(req, createReportDto);

      expect(result).toEqual(expectedResult);
      expect(userService.createReport).toHaveBeenCalledWith(
        userId,
        createReportDto,
      );
    });
  });

  describe('following', () => {
    it('should call UsersService following and return the result', async () => {
      const friendId = 2;

      const expectedResult: any = {
        id: 1,
        user_id: 1,
        friend_id: 2,
        created_at: undefined,
      };
      jest.spyOn(userService, 'following').mockResolvedValue(expectedResult);

      const result = await controller.following(req, friendId);

      expect(userService.following).toHaveBeenCalledWith({
        userId: req.user.id,
        friendId,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('unfollowing', () => {
    it('should call UsersService unfollowing and return the result', async () => {
      const friendId = 2;

      const expectedResult = {
        raw: [],
        affected: 1,
      };
      jest.spyOn(userService, 'unfollowing').mockResolvedValue(expectedResult);

      const result = await controller.unfollowing(req, friendId);

      expect(userService.unfollowing).toHaveBeenCalledWith({
        userId: req.user.id,
        friendId,
      });
      expect(result).toEqual(expectedResult);
    });
  });
});
