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
    const course = await this.prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        level: data.level,
        coverImageUrl: data.coverImageUrl,
      },
    });
    
    return {
      ...course,
      lessonSetsCount: 0
    };
  }

  async getAllCourses() {
    const courses = await this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { lessonSets: true }
        }
      }
    });

    return courses.map(course => ({
      ...course,
      lessonSetsCount: course._count.lessonSets
    }));
  }

  async getCourseById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        lessonSets: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
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

  async createLessonSet(courseId: string, data: { title: string; orderIndex: number }) {
    return this.prisma.lessonSet.create({
      data: {
        courseId,
        title: data.title,
        orderIndex: data.orderIndex,
      },
    });
  }

  async createLesson(lessonSetId: string, data: { title: string; type: any; orderIndex: number }) {
    return this.prisma.lesson.create({
      data: {
        lessonSetId,
        title: data.title,
        type: data.type,
        orderIndex: data.orderIndex,
      },
    });
  }

  async reorderLessonSets(courseId: string, updates: { id: string; orderIndex: number }[]) {
    // Thực hiện trong một transaction để đảm bảo toàn vẹn dữ liệu
    return this.prisma.$transaction(
      updates.map(update =>
        this.prisma.lessonSet.update({
          where: { id: update.id },
          data: { orderIndex: update.orderIndex },
        })
      )
    );
  }

  async reorderLessons(lessonSetId: string, updates: { id: string; orderIndex: number }[]) {
    return this.prisma.$transaction(
      updates.map(update =>
        this.prisma.lesson.update({
          where: { id: update.id },
          data: { orderIndex: update.orderIndex },
        })
      )
    );
  }
}
