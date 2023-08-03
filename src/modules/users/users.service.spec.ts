import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UpdateUserInfoDTO } from './dto/user.dto';
import { UsersRepository } from './user.repository';
import { Users } from './entities/user.entity';
import { Profile } from './type/profile.type';
import { CreateReportDto } from './dto/report.dto';
import { Reports } from './entities/report.entity';
import { Regions } from './entities/region.entity';
import { ChattingRoom } from '../posts/entities/chattingRoom.entity';
import { ChattingUsers } from '../posts/entities/chattingUsers.entity';
import { Posts } from '../posts/entities/posts.entity';
import { Friends } from './entities/friends.entity';

const mockUser: Users = {
  id: 1,
  userName: 'John Doe',
  imageUrl: 'http://example.com/image.jpg',
  phoneNumber: '123-456-7890',
  region: null,
  gender: 'F',
  email: '',
  kakaoId: '',
  createdAt: undefined,
  updatedAt: undefined,
  regionId: null,
  user: null,
  friend: null,
  report: null,
  attacker: null,
  post: null,
  chattingRoom: null,
  ChattingUsers: null,
};

const mockUserProfile: Profile = {
  id: 1,
  userName: 'John Doe',
  imageUrl: 'http://example.com/image.jpg',
  follow: false,
};

class UsersServiceMock {
  async findUserById(friendId: number, userId: number) {
    return mockUser;
  }

  async following(data: any) {
    return {
      id: 1,
      user_id: data.userId,
      friend_id: data.friendId,
      created_at: undefined,
      user: new Users(),
      friend: new Users(),
    };
  }

  async unfollowing(data: any) {
    return {
      raw: [],
      affected: 1,
    };
  }
}

const mockCreateReportDto: CreateReportDto = {
  friendId: 2,
  content: 'This is a test report.',
};

const mockReport: Reports = {
  friendId: 2,
  content: 'This is a test report.',
  userId: 1,
  id: 2,
  created_at: null,
  user: null,
  friend: null,
};

class UsersRepositoryMock {
  async getFriendsByUserId(userId: number): Promise<Friends[]> {
    return [
      {
        id: 1,
        userId: 1,
        friendId: 2,
        created_at: undefined,
        user: new Users(),
        friend: new Users(),
      },
      {
        id: 2,
        userId: 1,
        friendId: 3,
        created_at: undefined,
        user: new Users(),
        friend: new Users(),
      },
    ];
  }

  async getUserNamesByFriendIds(friendIds: number[]): Promise<string[]> {
    return friendIds.map((friendId) => `Friend ${friendId}`);
  }

  async findUserById(userId: number) {
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
      user: new Users(),
      friend: new Users(),
    };
  }

  async unfollowing(data: any) {
    return {
      raw: [],
      affected: 1,
    };
  }

  async checkRegion(regionId: number) {
    return 1;
  }

  async isfollowing(friendId: number, userId: number) {
    return false;
  }

  async createReport(userId: number, createReportDto: CreateReportDto) {
    return mockReport;
  }
}

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useClass: UsersRepositoryMock },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('getFriendList', () => {
    it('should return a list of friend names', async () => {
      const userId = 1;
      const mockFollowList: Friends[] = [
        {
          id: 1,
          userId: userId,
          friendId: 2,
          created_at: undefined,
          user: new Users(),
          friend: new Users(),
        },
        {
          id: 2,
          userId: userId,
          friendId: 3,
          created_at: undefined,
          user: new Users(),
          friend: new Users(),
        },
      ];
      const mockFriendIdList = [2, 3];
      const expectedFriendNames: any = ['Friend 2', 'Friend 3'];

      jest
        .spyOn(usersRepository, 'getFriendsByUserId')
        .mockResolvedValue(mockFollowList);
      jest
        .spyOn(usersRepository, 'getUserNamesByFriendIds')
        .mockResolvedValue(expectedFriendNames);

      const result = await usersService.getFriendList(userId);

      expect(result).toEqual(expectedFriendNames);
      expect(usersRepository.getFriendsByUserId).toHaveBeenCalledWith(userId);
      expect(usersRepository.getUserNamesByFriendIds).toHaveBeenCalledWith(
        mockFriendIdList,
      );
    });
  });

  describe('updateUserInfo', () => {
    it('should update user info', async () => {
      const userId = 1;
      const updateUserInfoDTO: UpdateUserInfoDTO = {
        userName: 'John Doe',
        phoneNumber: '123-456-7890',
        region: null,
        gender: 'F',
        imageUrl: 'http://example.com/image.jpg',
      };
      const mockRegion = 1;
      const expectedUpdatedUser: Users = {
        id: userId,
        ...updateUserInfoDTO,
        region: new Regions(),
        email: null,
        kakaoId: null,
        regionId: 1,
        createdAt: null,
        updatedAt: null,
        user: null,
        friend: null,
        report: null,
        attacker: new Reports(),
        post: new Posts(),
        chattingRoom: new ChattingRoom(),
        ChattingUsers: new ChattingUsers(),
      };

      jest.spyOn(usersRepository, 'checkRegion').mockResolvedValue(mockRegion);
      jest
        .spyOn(usersRepository, 'updateUserInfo')
        .mockResolvedValue(expectedUpdatedUser);

      const result = await usersService.updateUserInfo(
        userId,
        updateUserInfoDTO,
      );

      expect(result).toEqual(expectedUpdatedUser);
      expect(usersRepository.checkRegion).toHaveBeenCalledWith(
        updateUserInfoDTO.region,
      );
      expect(usersRepository.updateUserInfo).toHaveBeenCalledWith(
        userId,
        updateUserInfoDTO,
        mockRegion,
      );
    });
  });

  describe('findUserById', () => {
    it('should return a user profile', async () => {
      const friendId = 2;
      const userId = 1;

      jest.spyOn(usersRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(usersRepository, 'isfollowing').mockResolvedValue(false);

      const result = await usersService.findUserById(friendId, userId);

      expect(result).toEqual(mockUserProfile);
      expect(usersRepository.findUserById).toHaveBeenCalledWith(friendId);
      expect(usersRepository.isfollowing).toHaveBeenCalledWith(
        friendId,
        userId,
      );
    });
  });

  describe('createReport', () => {
    it('should create a report', async () => {
      const userId = 1;
      const expectedResult = mockReport;

      jest
        .spyOn(usersRepository, 'createReport')
        .mockResolvedValue(expectedResult);

      const result = await usersService.createReport(
        userId,
        mockCreateReportDto,
      );

      expect(result).toEqual(expectedResult);
      expect(usersRepository.createReport).toHaveBeenCalledWith(
        userId,
        mockCreateReportDto,
      );
    });
  });

  describe('following', () => {
    it('should follow a user and return the result', async () => {
      const friendId = 2;
      const userId = 1;
      const expectedFollowingResult: Friends = {
        id: 1,
        userId: 1,
        friendId: 2,
        created_at: undefined,
        user: new Users(),
        friend: new Users(),
      };

      jest
        .spyOn(usersService, 'following')
        .mockResolvedValue(expectedFollowingResult);

      const result = await usersService.following({
        userId,
        friendId,
      });

      expect(usersService.following).toHaveBeenCalledWith({
        userId,
        friendId,
      });
      expect(result).toEqual(expectedFollowingResult);
    });
  });

  describe('unfollowing', () => {
    it('should unfollow a user and return the result', async () => {
      const friendId = 2;
      const userId = 1;
      const friendDto: Friends = {
        id: 1,
        userId: 1,
        friendId: 2,
        created_at: undefined,
        user: new Users(),
        friend: new Users(),
      };
      const expectedResult = {
        raw: [],
        affected: 1,
      };

      jest.spyOn(usersService, 'unfollowing').mockResolvedValue(expectedResult);

      const result = await usersService.unfollowing(friendDto);

      expect(result).toEqual(expectedResult);
      expect(usersService.unfollowing).toHaveBeenCalledWith(friendDto);
    });
  });
});
