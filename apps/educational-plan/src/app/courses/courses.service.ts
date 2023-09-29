import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { SpecializationsService } from './specializations.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import * as uuid from "uuid";
import fs from "fs";
import { safePath } from '../lib/util';
import { UsersService } from '../users/users.service';


@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private coursesRepository: Repository<Course>,
    private readonly specializationsService: SpecializationsService,
    private readonly usersService: UsersService,
  ) {}

  async findAll() {
    return this.coursesRepository.find();
  }

  async findAllByUserId(userId: string) {
    const user = await this.usersService.findOne(userId);
    return this.coursesRepository.find({ where: { user } });
  }

  async findOne(id: string) {
    const course = await this.coursesRepository.findOne({ where: { id } });
    if(!course) {
      throw new NotFoundException(`Cursul cu ID-ul ${id} nu a fost găsit.`);
    }
    return course;
  }

  async create(courseDto: CreateCourseDto) {
    const specialization = await this.specializationsService.findOne(courseDto.specializationId);
    return this.coursesRepository.save({ ...courseDto, specialization });
  }

  async update(id: string, courseDto: UpdateCourseDto) {
    const course = await this.findOne(id);
    const specialization = await this.specializationsService.findOne(courseDto.specializationId);
    return this.coursesRepository.save({ ...course, ...courseDto, specialization });
  }

  async updateCurriculumFile(id: string, curricullumFile: Buffer) {
    const course = await this.findOne(id);
    const fileId = uuid.v4();
    const curriculumPath = safePath(__dirname, 'uploads', `${fileId}.pdf`);
    fs.writeFileSync(curriculumPath, curricullumFile);
    return this.coursesRepository.save({ ...course, curriculumPath: `/uploads/${fileId}.pdf` });
  }

  async delete(id: string) {
    const course = await this.findOne(id);
    return this.coursesRepository.remove(course);
  }

}
