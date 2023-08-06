import { Optional } from '@nestjs/common';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly kakaoId: string;

  @IsString()
  @Optional()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly imageUrl: string;

  @IsOptional()
  @IsString()
  readonly gender: string;
}

export class UpdateUserInfoDTO {
  @IsString()
  readonly userName: string;

  @IsString()
  readonly phoneNumber: string;

  @IsString()
  readonly region: string;

  @IsString()
  readonly gender: string;

  @IsOptional()
  @IsString()
  readonly imageUrl: string;
}
