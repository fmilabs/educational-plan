import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from './entities/domain.entity';
import { Specialization } from './entities/specialization.entity';
import { DomainsController } from './domains.controller';
import { DomainsService } from './domains.service';
import { SpecializationsService } from './specializations.service';
import { SpecializationsController } from './specializations.controller';
import { Course } from './entities/course.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Domain, Specialization, Course]),
  ],
  controllers: [DomainsController, SpecializationsController, CoursesController],
  providers: [DomainsService, SpecializationsService, CoursesService],
  exports: [DomainsService, SpecializationsService, CoursesService],
})
export class CoursesModule {}
