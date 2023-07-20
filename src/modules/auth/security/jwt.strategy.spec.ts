import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from '../auth.service';
import { Users } from 'src/modules/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Payload } from '../type';

class MockAuthService {
  findUserById = jest.fn();
}

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let authService: MockAuthService;
  const userMock: Users = {
    id: 1,
    email: 'test@example.com',
    kakaoId: '12345',
    userName: 'TestUser',
    phoneNumber: '010-1234-5678',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    regionId: null,
    region: null,
    user: null,
    friend: null,
    report: null,
    attacker: null,
    post: null,
    chattingRoom: null,
    ChattingUsers: null,
    imageUrl: null,
  };

  const payloadMock: Payload = {
    userId: userMock.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };

  beforeEach(async () => {
    authService = new MockAuthService();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: AuthService, useValue: authService },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('your-secret-key'),
          },
        },
      ],
    }).compile();

    jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should validate and return user for valid token', async () => {
    const validateSpy = jest.spyOn(authService, 'findUserById');
    authService.findUserById.mockResolvedValue(userMock);

    const user = await jwtStrategy.validate(payloadMock);

    expect(validateSpy).toHaveBeenCalledWith(payloadMock.userId);
    expect(user).toEqual(userMock);
  });

  it('should throw UnauthorizedException for expired token', async () => {
    const expiredPayloadMock: Payload = {
      userId: userMock.id,
      exp: Math.floor(Date.now() / 1000) - 1,
    };

    await expect(jwtStrategy.validate(expiredPayloadMock)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException for invalid user', async () => {
    authService.findUserById.mockResolvedValue(null);

    await expect(jwtStrategy.validate(payloadMock)).rejects.toThrowError(
      UnauthorizedException,
    );
  });
});
