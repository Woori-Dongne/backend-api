import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/login.request';
import { Tokens } from './type/token.type';
import { RTAuthGuard } from './security/rtauth.guard';
import { RequestUser } from './type/req.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('on-notify')
  async checkOnNotify(@Req() req) {
    console.log(req.headers);
    console.log(req.body);
    return { reponse: 'OK'}
  }
  @Post('kakao')
  async kakaoLogin(@Body() kakaoToken: LoginRequest): Promise<Tokens> {
    return await this.authService.kakaoLogin(kakaoToken);
  }

  @UseGuards(RTAuthGuard)
  @Post('refresh')
  async refreshToken(@Req() req: RequestUser): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.authService.generateAccessToken(req.user.id),
      this.authService.generateRefreshToken(req.user.id),
    ]);
    return { accessToken, refreshToken };
  }
}
