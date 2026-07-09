import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    const maxCourse = await this.prisma.course.findFirst({
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true }
    });
    const nextIndex = (maxCourse?.orderIndex ?? -1) + 1;

    return this.prisma.course.create({
      data: {
        ...createCourseDto,
        orderIndex: nextIndex
      },
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      orderBy: [
        { orderIndex: 'asc' },
        { createdAt: 'desc' }
      ],
    });
  }

  async reorder(orderedIds: string[]) {
    // Cập nhật hàng loạt bằng transaction
    const updatePromises = orderedIds.map((id, index) =>
      this.prisma.course.update({
        where: { id },
        data: { orderIndex: index },
      })
    );
    return this.prisma.$transaction(updatePromises);
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException(`Không tìm thấy khóa học với id ${id}`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    await this.findOne(id);
    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.course.delete({
      where: { id },
    });
  }
}
