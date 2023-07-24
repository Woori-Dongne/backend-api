import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/login.request';
import { Tokens } from './type/token.type';
import { UsersRepository } from '../users/user.repository';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {}, // 빈 객체를 제공하여 UsersRepository 의존성을 제거
        },
        JwtService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('kakaoLogin', () => {
    it('should return access and refresh token', async () => {
      const kakaoToken: LoginRequest = { AccessToken: 'mockedAccessToken' };
      const mockedTokens: Tokens = {
        accessToken: 'mockedAccessToken',
        refreshToken: 'mockedRefreshToken',
      };
      // AuthService의 kakaoLogin 메서드 모의(mock)
      jest.spyOn(authService, 'kakaoLogin').mockResolvedValue(mockedTokens);

      const result = await controller.kakaoLogin(kakaoToken);

      expect(result).toEqual(mockedTokens);
      expect(authService.kakaoLogin).toHaveBeenCalledWith(kakaoToken);
    });
  });
});
