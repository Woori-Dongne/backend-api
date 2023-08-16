import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { UsersRepository } from '../users/user.repository';
import { LoginRequest } from './dto/login.request';
import { CreateUserDto } from 'src/modules/users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async kakaoLogin(kakaoToken: LoginRequest) {
    let newbie = false;

    const user = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${kakaoToken.AccessToken}` },
    });

    if (!user) {
      throw new UnauthorizedException('NOT IN KAKAO');
    }

    const data = user.data;

    let dbUser = await this.usersRepository.getUserByEmail(
      data.kakao_account.email,
    );

    if (!dbUser) {
      newbie = true;
      const createUserDto: CreateUserDto = {
        kakaoId: data.id,
        email: data.kakao_account?.email,
        imageUrl: data.kakao_account?.profile.profile_image_url,
        gender: data.kakao_account?.gender,
      };
      dbUser = await this.usersRepository.createUser(createUserDto);
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(dbUser.id),
      this.generateRefreshToken(dbUser.id),
    ]);

    return { accessToken, refreshToken, newbie };
  }

  async generateAccessToken(id: number): Promise<string> {
    return this.jwtService.sign({ userId: id }, { expiresIn: '1d' });
  }

  async generateRefreshToken(id: number): Promise<string> {
    return this.jwtService.sign({ userId: id }, { expiresIn: '7d' });
  }

  async findUserById(userId: number): Promise<Users> {
    return this.usersRepository.findUserById(userId);
  }
}
