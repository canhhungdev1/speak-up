import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto) {
    const lessonSet = await this.prisma.lessonSet.findUnique({
      where: { id: createLessonDto.lessonSetId },
    });
    if (!lessonSet) {
      throw new NotFoundException('Lesson Set not found');
    }

    return this.prisma.lesson.create({
      data: createLessonDto,
    });
  }

  findAllByLessonSet(lessonSetId: string) {
    return this.prisma.lesson.findMany({
      where: { lessonSetId },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    await this.findOne(id);
    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}
