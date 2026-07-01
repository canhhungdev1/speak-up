import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

export class CreateCourseDto {
  title: string;
  description?: string;
  level: string;
  coverImageUrl?: string;
}

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async createCourse(data: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        level: data.level,
        coverImageUrl: data.coverImageUrl,
      },
    });
  }

  async getAllCourses() {
    return this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCourseById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        lessonSets: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }
}
