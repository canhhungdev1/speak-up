import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateLessonSetDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  requiredDays?: number;
}
