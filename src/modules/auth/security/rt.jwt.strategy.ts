import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Users } from 'src/modules/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Payload } from '../type';

@Injectable()
export class RTJwtStrategy extends PassportStrategy(Strategy, 'rt-jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    super({
      secretOrKey: config.get('SECRET_KEY'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: Payload) {
    const expirationTime = payload.exp;

    const currentTime = Math.floor(Date.now() / 1000);

    if (expirationTime < currentTime) {
      throw new UnauthorizedException('The token has expired.');
    }
    const user: Users = await this.authService.findUserById(payload.userId);

    if (!user) {
      throw new UnauthorizedException('There is no valid user.');
    }

    return user;
  }
}
