import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

import { UsersRepository } from '../users/user.repository';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { Users } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersRepository: Partial<UsersRepository>; // UsersRepository의 모의 객체
  let mockJwtService: Partial<JwtService>; // JwtService의 모의 객체

  beforeEach(async () => {
    // 모의 객체 초기화
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
          useValue: mockUsersRepository, // UsersRepository의 모의 객체 주입
        },
        {
          provide: JwtService,
          useValue: mockJwtService, // JwtService의 모의 객체 주입
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
    // describe 블록 안에 kakaoLogin 테스트 케이스를 정의
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
        role: null,
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

      // axios.get 모의
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
