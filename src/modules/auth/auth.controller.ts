import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/login.request';
import { Tokens } from './type/token.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('kakao')
  async kakaoLogin(@Body() kakaoToken: LoginRequest): Promise<Tokens> {
    return await this.authService.kakaoLogin(kakaoToken);
  }
}
