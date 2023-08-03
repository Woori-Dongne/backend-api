import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RequestUser } from '../auth/type/req.interface';
import { UpdateUserInfoDTO } from './dto/user.dto';
import { Profile } from './type/profile.type';
import { Friend } from './type/friendList.type';
import { CreateReportDto } from './dto/report.dto';
import { Reports } from './entities/report.entity';

const mockFriendList: Friend[] = [
  { id: 2, userName: '친구 1', imageUrl: 'gooogle.com' },
  { id: 3, userName: '친구 2', imageUrl: 'gogle.com' },
];

const mockUserProfile: Profile = {
  id: 1,
  userName: 'John Doe',
  imageUrl: 'http://example.com/image.jpg',
  follow: false,
};

const mockReport: Reports = {
  id: 1,
  userId: 1,
  friendId: 1,
  content: '먹튀',
  user: null,
  friend: null,
  created_at: null,
};

const mockUser: UpdateUserInfoDTO = {
  userName: 'John Doe',
  phoneNumber: '123-456-7890',
  region: null,
  gender: 'F',
  imageUrl: 'http://example.com/image.jpg',
};

class MockUsersService {
  getFriendList = jest.fn().mockResolvedValue(mockFriendList);
  findUserById = jest.fn().mockResolvedValue(mockUserProfile);
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
      providers: [{ provide: UsersService, useClass: MockUsersService }],
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

  describe('getFriendList', () => {
    it('should call UsersService getFriendList and return the result', async () => {
      const expectedResult: Friend[] = [
        { id: 2, userName: '친구 1', imageUrl: 'gooogle.com' },
        { id: 3, userName: '친구 2', imageUrl: 'gogle.com' },
      ];

      const result = await controller.getFriendList(req);

      expect(userService.getFriendList).toHaveBeenCalledWith(req.user.id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findUserById', () => {
    it('should return a user profile', async () => {
      const friendId = 2;

      const result = await controller.findUserById(req, friendId);

      expect(result).toEqual(mockUserProfile);
      expect(userService.findUserById).toHaveBeenCalledWith(
        friendId,
        req.user.id,
      );
    });
  });

  describe('updateUserInfo', () => {
    it('should call UsersService updateUserInfo and return the result', async () => {
      const updateUserInfoDTO: UpdateUserInfoDTO = {
        imageUrl: 'http://example.com/image.jpg',
        phoneNumber: '123-456-7890',
        region: null,
        gender: 'F',
        userName: 'John Doe',
      };

      const expectedResult: any = {
        ...updateUserInfoDTO,
      };

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
        id: 1,
        userId: 1,
        friendId: 1,
        content: '먹튀',
        user: null,
        friend: null,
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
