import { Body, Controller, Delete, Get, Param, Post, Put, Query, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Role } from '@educational-plan/types';
import { Public } from '../auth/decorators/public.decorator';
import { CourseQueryDto } from './dto/course-query.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  private async editGuard(id: string, user: User) {
    if(user.role != Role.Admin) {
      const course = await this.coursesService.findOne(id);
      if(course.user.id != user.id) {
        throw new UnauthorizedException();
      }
    }
  }

  @Post()
  async create(@Body() courseDto: CreateCourseDto, @CurrentUser() user: User) {
    if(user.role != Role.Admin || !courseDto.userId) {
      courseDto.userId = user.id;
    }
    return this.coursesService.create(courseDto);
  }

  @Get()
  @Public()
  async findAll(@Query() courseQueryDto: CourseQueryDto = {}) {
    return this.coursesService.findAll(courseQueryDto);
  }

  @Get('my')
  async findAllByUserId(@CurrentUser() user: User) {
    return this.coursesService.findAllByUserId(user.id);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() courseDto: UpdateCourseDto, @CurrentUser() user: User) {
    await this.editGuard(id, user);
    return this.coursesService.update(id, courseDto);
  }

  @Post(':id/curriculum')
  @UseInterceptors(FileInterceptor('file'))
  async updateCurriculumFile(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @CurrentUser() user: User) {
    await this.editGuard(id, user);
    return this.coursesService.updateCurriculumFile(id, file.buffer);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    await this.editGuard(id, user);
    return this.coursesService.delete(id);
  }

}
