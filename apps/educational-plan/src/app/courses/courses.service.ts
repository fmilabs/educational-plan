import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { CourseQueryDto } from './dto/course-query.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private coursesRepository: Repository<Course>,
    private readonly specializationsService: SpecializationsService,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private createQueryBuilder() {
    return this.coursesRepository.createQueryBuilder('course')
      .innerJoinAndSelect('course.user', 'user')
      .innerJoinAndSelect('course.specialization', 'specialization')
      .innerJoinAndSelect('specialization.domain', 'domain')
      .addOrderBy('domain.type', 'ASC')
      .addOrderBy("(CASE WHEN domain.studyForm = 'IF' THEN 0 ELSE 1 END)")
      .addOrderBy('specialization.name', 'ASC')
      .addOrderBy('specialization.id', 'ASC')
      .addOrderBy('course.year', 'ASC')
      .addOrderBy('course.semester', 'ASC')
      .addOrderBy('course.optional', 'ASC')
      .addOrderBy('course.credits', 'ASC');
  }

  async findAll(courseQueryDto?: CourseQueryDto) {
    const { specializationId, ...where } = courseQueryDto as Record<string, any>;
    if (specializationId) {
      where.specialization = { id: courseQueryDto.specializationId };
    }
    return this.createQueryBuilder().where(where).getMany();
  }

  async findAllByUserId(userId: string) {
    const user = await this.usersService.findOne(userId);
    return this.createQueryBuilder().where({ user }).getMany();
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
    const user = await this.usersService.findOne(courseDto.userId);
    const result = await this.coursesRepository.save({ ...courseDto, specialization, user });
    this.cacheManager.reset();
    return result;
  }

  async update(id: string, courseDto: UpdateCourseDto) {
    const course = await this.findOne(id);
    const specialization = await this.specializationsService.findOne(courseDto.specializationId);
    const user = await this.usersService.findOne(courseDto.userId);
    const result = await this.coursesRepository.save({ ...course, ...courseDto, specialization, user });
    this.cacheManager.reset();
    return result;
  }

  async updateCurriculumFile(id: string, curricullumFile: Buffer) {
    const course = await this.findOne(id);
    const fileId = uuid.v4();
    const curriculumPath = safePath(__dirname, 'uploads', `${fileId}.pdf`);
    fs.writeFileSync(curriculumPath, curricullumFile);
    const result = await this.coursesRepository.save({
      ...course,
      curriculumPath: `/uploads/${fileId}.pdf`,
      curriculumUpdatedAt: new Date(),
      updatedAt: new Date(),
    });
    this.cacheManager.reset();
    return result;
  }

  async delete(id: string) {
    const course = await this.findOne(id);
    const result = await this.coursesRepository.remove(course);
    this.cacheManager.reset();
    return result;
  }

}
