import { Optional } from '@nestjs/common';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateChattingPostDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsNumber()
  readonly personnel: number;

  @IsString()
  readonly category: number;

  @IsString()
  readonly regionId: number;

  @IsString()
  readonly detailRegion: string;

  @IsString()
  @IsOptional()
  readonly imageUrl: string;

  @IsString()
  @IsOptional()
  readonly deadline: Date;
}

export class JoinChattingRoomDto {
  @IsString()
  readonly roomName: string;

  @IsNumber()
  readonly postId: number;
}
