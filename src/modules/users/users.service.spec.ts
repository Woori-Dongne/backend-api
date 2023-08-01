import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RequestUser } from '../auth/type/req.interface';
import { UpdateUserInfoDTO } from './dto/user.dto';
import { Users } from './entities/user.entity';
import { Regions } from './entities/region.entity';
import { UsersRepository } from './user.repository';
import { Profile } from './type/profile.type';

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
  userName: 'TestUser',
  imageUrl: 'test-image.jpg',
  follow: false,
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
}

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let controller: UsersController;
  let req: RequestUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: UsersRepository, useClass: UsersRepositoryMock },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
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

  describe('updateUserInfo', () => {
    it('should save user information', async () => {
      const updateUserInfoDTO: UpdateUserInfoDTO = {
        userName: 'John Doe',
        phoneNumber: '123-456-7890',
        region: null,
        role: 'user',
        imageUrl: 'http://example.com/image.jpg',
      };

      jest.spyOn(usersService, 'updateUserInfo').mockResolvedValue(mockUser);
      jest.spyOn(usersRepository, 'checkRegion').mockResolvedValue(1); // 수정된 부분

      const result = await controller.updateUserInfo(req, updateUserInfoDTO);

      expect(result).toMatchObject({
        ...updateUserInfoDTO,
        id: req.user.id,
      });
      expect(usersService.updateUserInfo).toHaveBeenCalledWith(
        req.user.id,
        updateUserInfoDTO,
      );
    });
  });

  describe('findUserById', () => {
    it('should return a user profile', async () => {
      const friendId = 2;

      jest
        .spyOn(usersService, 'findUserById')
        .mockResolvedValue(mockUserProfile);

      const result = await controller.findUserById(req, friendId);

      expect(result).toEqual(mockUserProfile);
    });
  });
});
