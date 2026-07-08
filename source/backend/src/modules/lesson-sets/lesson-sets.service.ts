import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonSetDto } from './dto/create-lesson-set.dto';
import { UpdateLessonSetDto } from './dto/update-lesson-set.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LessonSetsService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonSetDto: CreateLessonSetDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: createLessonSetDto.courseId },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.lessonSet.create({
      data: createLessonSetDto,
    });
  }

  findAllByCourse(courseId: string) {
    return this.prisma.lessonSet.findMany({
      where: { courseId },
      orderBy: { orderIndex: 'asc' },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        }
      }
    });
  }

  async findOne(id: string) {
    const lessonSet = await this.prisma.lessonSet.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        }
      }
    });
    if (!lessonSet) {
      throw new NotFoundException('Lesson Set not found');
    }
    return lessonSet;
  }

  async update(id: string, updateLessonSetDto: UpdateLessonSetDto) {
    await this.findOne(id); // Ensure it exists
    return this.prisma.lessonSet.update({
      where: { id },
      data: updateLessonSetDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.lessonSet.delete({
      where: { id },
    });
  }
}
