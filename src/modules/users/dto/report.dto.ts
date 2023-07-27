import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  friendId: number;

  @IsString()
  content: string;
}
