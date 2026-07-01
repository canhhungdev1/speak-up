import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
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
}
