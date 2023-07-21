import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './user.repository';
import { UpdateUserInfoDTO } from './dto/user.dto';
import { Users } from './entities/user.entity';
import { Regions } from './entities/region.entity';
import { ChattingRoom } from '../posts/entities/chattingRoom.entity';
import { ChattingUsers } from '../posts/entities/chattingUsers.entity';
import { Posts } from '../posts/entities/posts.entity';
import { Friends } from './entities/friends.entity';
import { Reports } from './entities/report.entity';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            updateUserInfo: jest.fn(), // Mocking the saveUserInfo method
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveUserInfo', () => {
    it('should save user information', async () => {
      const updateUserInfoDTO: UpdateUserInfoDTO = {
        userName: 'John Doe',
        phoneNumber: '123-456-7890',
        region: 1,
        role: 'user',
        imageUrl: 'http://example.com/image.jpg',
      };
      const userId = 1;

      const savedUser: Users = {
        id: 1,
        userName: 'John Doe',
        phoneNumber: '123-456-7890',
        region: new Regions(),
        role: 'user',
        imageUrl: 'http://example.com/image.jpg',
        email: '',
        kakaoId: '',
        createdAt: null,
        updatedAt: null,
        regionId: null,
        user: null,
        friend: null,
        report: new Reports(),
        attacker: new Reports(),
        post: new Posts(),
        chattingRoom: new ChattingRoom(),
        ChattingUsers: new ChattingUsers(),
      };

      jest
        .spyOn(usersRepository, 'updateUserInfo')
        .mockImplementation(async () => savedUser);

      const result = await service.updateUserInfo(userId, updateUserInfoDTO);

      expect(result).toEqual(savedUser);
      expect(usersRepository.updateUserInfo).toHaveBeenCalledWith(
        1,
        updateUserInfoDTO,
      );
    });
  });
});
