import { Optional } from '@nestjs/common';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly kakaoId: string;

  @IsString()
  @Optional()
  readonly email: string;
}

export class UpdateUserInfoDTO {
  @IsString()
  readonly userName: string;

  @IsString()
  readonly phoneNumber: string;

  @IsNumber()
  readonly region: number;

  @IsString()
  readonly role: string;

  @IsOptional()
  @IsString()
  readonly imageUrl: string;
}
