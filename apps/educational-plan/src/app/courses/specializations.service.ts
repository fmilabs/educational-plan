import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Specialization } from './entities/specialization.entity';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { DomainsService } from './domains.service';


@Injectable()
export class SpecializationsService {
  constructor(
    @InjectRepository(Specialization) private specializationsRepository: Repository<Specialization>,
    private readonly domainsService: DomainsService,
  ) {}

  async findAll() {
    return this.specializationsRepository.find();
  }

  async findAllByIds(ids: string[]) {
    return this.specializationsRepository.find({ where: { id: In(ids) } });
  }

  async findOne(id: string) {
    const specialization = await this.specializationsRepository.findOne({ where: { id } });
    if(!specialization) {
      throw new NotFoundException(`Programul de studiu cu ID-ul ${id} nu a fost găsit.`);
    }
    return specialization;
  }

  async create(specializationDto: CreateSpecializationDto) {
    const domain = await this.domainsService.findOne(specializationDto.domainId);
    return this.specializationsRepository.save({ ...specializationDto, domain });
  }

  async update(id: string, specializationDto: UpdateSpecializationDto) {
    const specialization = await this.findOne(id);
    const domain = await this.domainsService.findOne(specializationDto.domainId);
    return this.specializationsRepository.save({ ...specialization, ...specializationDto, domain });
  }

  async delete(id: string) {
    const specialization = await this.findOne(id);
    return this.specializationsRepository.remove(specialization);
  }

}
