import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsNumber()
  category: number;

  @IsNumber()
  personnel: number;

  @IsString()
  content: string;

  @IsString()
  title: string;

  @IsString()
  imageUrl: string;

  @IsString()
  detailRegion: string;
}
