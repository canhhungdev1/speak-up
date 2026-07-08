import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonSetDto } from './create-lesson-set.dto';

export class UpdateLessonSetDto extends PartialType(CreateLessonSetDto) {}
