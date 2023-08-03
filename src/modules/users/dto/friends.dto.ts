import { Optional } from '@nestjs/common';
import { IsNumber } from 'class-validator';

export class FriendsDto {
  @IsNumber()
  @Optional()
  readonly userId: number;

  @IsNumber()
  readonly friendId: number;
}
