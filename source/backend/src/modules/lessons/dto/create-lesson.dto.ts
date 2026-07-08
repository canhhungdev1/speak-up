import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum, IsUrl } from 'class-validator';
import { LessonType } from '@prisma/client';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  lessonSetId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(LessonType)
  @IsNotEmpty()
  type: LessonType;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  audioUrl: string;

  @IsInt()
  @IsOptional()
  durationSeconds?: number;

  @IsInt()
  @IsOptional()
  orderIndex?: number;
}
