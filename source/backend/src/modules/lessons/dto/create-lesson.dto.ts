import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum, IsUrl, IsNumber, ValidateIf } from 'class-validator';
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
  @IsOptional()
  @ValidateIf(o => o.audioUrl && o.audioUrl !== '')
  @IsUrl()
  audioUrl?: string;

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
