import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Profile } from './type/profile.type';
import { RequestUser } from '../auth/type/req.interface';
import { UpdateUserInfoDTO } from './dto/user.dto';
import { CreateReportDto } from './dto/report.dto';

const mockUser: Profile = {
  id: 1,
  userName: 'TestUser',
  imageUrl: 'test-image.jpg',
  follow: false,
};

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
});
