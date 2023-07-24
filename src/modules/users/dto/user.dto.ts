import { Optional } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly kakaoId: string;

  @IsString()
  @Optional()
  readonly email: string;
}
