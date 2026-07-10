import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum, IsUrl, IsNumber } from 'class-validator';
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

  @IsOptional()
  @IsNumber()
  orderIndex?: number;

  @IsOptional()
  @IsString()
  htmlContent?: string;
}
