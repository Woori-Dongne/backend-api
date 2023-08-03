import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

import { UsersRepository } from '../users/user.repository';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { Users } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersRepository: Partial<UsersRepository>;
  let mockJwtService: Partial<JwtService>;

  beforeEach(async () => {
    mockUsersRepository = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockUsersRepository: module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('kakaoLogin', () => {
    it('should return access and refresh tokens', async () => {
      const kakaoToken = { AccessToken: 'mockedAccessToken' };
      const user = {
        id: 1,
        kakao_account: {
          email: 'test@example.com',
        },
      };
      const users: Users = {
        id: 1,
        email: 'test@example.com',
        kakaoId: '1',
        userName: null,
        phoneNumber: null,
        gender: null,
        createdAt: null,
        updatedAt: null,
        user: null,
        friend: null,
        report: null,
        attacker: null,
        post: null,
        chattingRoom: null,
        ChattingUsers: null,
        region: null,
        regionId: null,
        imageUrl: null,
      };
      const mockedAccessToken = 'mockedToken';
      const mockedRefreshToken = 'mockedToken';

      jest.spyOn(axios, 'get').mockResolvedValue({ data: user });

      jest
        .spyOn(mockUsersRepository, 'getUserByEmail')
        .mockResolvedValue(users);

      jest
        .spyOn(mockJwtService, 'sign')
        .mockReturnValueOnce(mockedAccessToken)
        .mockReturnValueOnce(mockedRefreshToken);

      const result = await service.kakaoLogin(kakaoToken);

      expect(result.accessToken).toBe('mockedToken');
      expect(result.refreshToken).toBe('mockedToken');
      expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { userId: 1 },
        { expiresIn: '1d' },
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { userId: 1 },
        { expiresIn: '7d' },
      );
    });
  });
});
