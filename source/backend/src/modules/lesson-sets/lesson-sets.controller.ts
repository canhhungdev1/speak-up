import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { LessonSetsService } from './lesson-sets.service';
import { CreateLessonSetDto } from './dto/create-lesson-set.dto';
import { UpdateLessonSetDto } from './dto/update-lesson-set.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('lesson-sets')
@UseGuards(JwtAuthGuard)
export class LessonSetsController {
  constructor(private readonly lessonSetsService: LessonSetsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() createLessonSetDto: CreateLessonSetDto) {
    return this.lessonSetsService.create(createLessonSetDto);
  }

  @Get()
  findAll(@Query('courseId') courseId: string) {
    if (courseId) {
      return this.lessonSetsService.findAllByCourse(courseId);
    }
    return []; // For safety, only allow querying by courseId
  }

  @Patch('reorder')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  reorder(@Body() body: { orderedIds: string[] }) {
    return this.lessonSetsService.reorder(body.orderedIds);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonSetsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateLessonSetDto: UpdateLessonSetDto) {
    return this.lessonSetsService.update(id, updateLessonSetDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.lessonSetsService.remove(id);
  }
}
