import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { CoursesService, CreateCourseDto } from './courses.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createCourse(@Body() data: CreateCourseDto) {
    return this.coursesService.createCourse(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getCourseById(@Param('id') id: string) {
    return this.coursesService.getCourseById(id);
  }

  @Post(':id/lesson-sets')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createLessonSet(
    @Param('id') id: string,
    @Body() data: { title: string; orderIndex: number }
  ) {
    return this.coursesService.createLessonSet(id, data);
  }

  @Post('lesson-sets/:setId/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createLesson(
    @Param('setId') setId: string,
    @Body() data: { title: string; type: any; orderIndex: number }
  ) {
    return this.coursesService.createLesson(setId, data);
  }

  @Put(':id/lesson-sets/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  reorderLessonSets(
    @Param('id') id: string,
    @Body() updates: { id: string; orderIndex: number }[]
  ) {
    return this.coursesService.reorderLessonSets(id, updates);
  }

  @Put('lesson-sets/:setId/lessons/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  reorderLessons(
    @Param('setId') setId: string,
    @Body() updates: { id: string; orderIndex: number }[]
  ) {
    return this.coursesService.reorderLessons(setId, updates);
  }
}
