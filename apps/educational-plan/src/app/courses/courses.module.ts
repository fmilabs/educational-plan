import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from './entities/domain.entity';
import { Specialization } from './entities/specialization.entity';
import { DomainsController } from './domains.controller';
import { DomainsService } from './domains.service';
import { SpecializationsService } from './specializations.service';
import { SpecializationsController } from './specializations.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Domain, Specialization]),
  ],
  controllers: [DomainsController, SpecializationsController],
  providers: [DomainsService, SpecializationsService],
  exports: [DomainsService, SpecializationsService],
})
export class CoursesModule {}
