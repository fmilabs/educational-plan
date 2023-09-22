import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(@Body() courseDto: CreateCourseDto) {
    return this.coursesService.create(courseDto);
  }

  @Get()
  async findAll() {
    return this.coursesService.findAll();
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
