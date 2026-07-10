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

    const { transcripts, vttContent, ...lessonData } = createLessonDto as any;

    const createdLesson = await this.prisma.lesson.create({
      data: lessonData,
    });

    if (transcripts && transcripts.length > 0) {
      await this.prisma.transcript.createMany({
        data: transcripts.map((t, index) => ({
          lessonId: createdLesson.id,
          startTime: t.startTime || 0,
          endTime: t.endTime || 0,
          textContent: t.textContent,
          vocabularyWord: t.vocabularyWord,
          orderIndex: index
        }))
      });
    }

    return this.findOne(createdLesson.id);
  }

  findAllByLessonSet(lessonSetId: string) {
    return this.prisma.lesson.findMany({
      where: { lessonSetId },
      orderBy: { orderIndex: 'asc' },
      include: {
        transcripts: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        transcripts: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    await this.findOne(id);
    const { transcripts, vttContent, ...lessonData } = updateLessonDto as any;
    
    // Nếu có gửi lên transcripts, xóa hết cái cũ và tạo mới lại (Transaction)
    if (transcripts) {
      return this.prisma.$transaction(async (prisma) => {
        await prisma.transcript.deleteMany({
          where: { lessonId: id }
        });
        
        if (transcripts.length > 0) {
          await prisma.transcript.createMany({
            data: transcripts.map((t, index) => ({
              lessonId: id,
              startTime: t.startTime || 0,
              endTime: t.endTime || 0,
              textContent: t.textContent,
              vocabularyWord: t.vocabularyWord,
              orderIndex: index
            }))
          });
        }
        
        await prisma.lesson.update({
          where: { id },
          data: lessonData,
        });

        return prisma.lesson.findUnique({
          where: { id },
          include: {
            transcripts: {
              orderBy: { orderIndex: 'asc' }
            }
          }
        });
      });
    }

    await this.prisma.lesson.update({
      where: { id },
      data: lessonData,
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}
