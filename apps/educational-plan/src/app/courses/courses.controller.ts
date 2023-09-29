import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Role } from '@educational-plan/types';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(@Body() courseDto: CreateCourseDto, @CurrentUser() user: User) {
    if(user.role != Role.Admin || !courseDto.userId) {
      console.log(user);
      courseDto.userId = user.id;
    }
    return this.coursesService.create(courseDto);
  }

  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  @Get('my')
  async findAllByUserId(@CurrentUser() user: User) {
    return this.coursesService.findAllByUserId(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() courseDto: UpdateCourseDto) {
    return this.coursesService.update(id, courseDto);
  }

  @Post(':id/curriculum')
  @UseInterceptors(FileInterceptor('file'))
  async updateCurriculumFile(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.coursesService.updateCurriculumFile(id, file.buffer);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }

}
