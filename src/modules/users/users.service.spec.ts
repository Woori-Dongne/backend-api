import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './user.repository';
import { UpdateUserInfoDTO } from './dto/user.dto';
import { Users } from './entities/user.entity';
import { Profile } from './type/profile.type';
import { CreateReportDto } from './dto/report.dto';
import { Reports } from './entities/report.entity';

const mockUser: Users = {
  id: 1,
  userName: 'John Doe',
  imageUrl: 'http://example.com/image.jpg',
  phoneNumber: '123-456-7890',
  region: null,
  role: 'user',
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
  async findUserById(userId: number) {
    return mockUser;
  }

  async updateUserInfo(userId: number, updateUserInfoDTO: UpdateUserInfoDTO) {
    return {
      ...updateUserInfoDTO,
      id: userId,
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

  describe('updateUserInfo', () => {
    it('should save userinfo', async () => {
      const userId = 1;
      const updateUserInfoDTO: UpdateUserInfoDTO = {
        userName: 'John Doe',
        phoneNumber: '123-456-7890',
        region: null,
        role: 'user',
        imageUrl: 'http://example.com/image.jpg',
      };

      jest.spyOn(usersRepository, 'checkRegion').mockResolvedValue(1);

      const result = await usersService.updateUserInfo(
        userId,
        updateUserInfoDTO,
      );

      expect(result).toMatchObject({
        ...updateUserInfoDTO,
        id: userId,
      });
    });
  });

  describe('findUserById', () => {
    it('should return user profile', async () => {
      const friendId = 2;
      const userId = 1;

      jest.spyOn(usersRepository, 'isfollowing').mockResolvedValue(false);

      const result = await usersService.findUserById(friendId, userId);

      expect(result).toEqual(mockUserProfile);
      expect(usersRepository.isfollowing).toHaveBeenCalledWith(
        friendId,
        userId,
      );
    });
  });

  describe('createReport', () => {
    it('should create a report', async () => {
      const userId = 1;

      jest.spyOn(usersRepository, 'createReport').mockResolvedValue(mockReport);

      const result = await usersService.createReport(
        userId,
        mockCreateReportDto,
      );

      expect(result).toEqual(mockReport);
      expect(usersRepository.createReport).toHaveBeenCalledWith(
        userId,
        mockCreateReportDto,
      );
    });
  });
});
