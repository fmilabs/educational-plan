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

  async create({ series, ...dtoRest }: CreateSpecializationDto) {
    const domain = await this.domainsService.findOne(dtoRest.domainId);
    return this.specializationsRepository.save({
      ...dtoRest,
      domain,
      series: series.map(number => ({ number })),
    });
  }

  async update(id: string, { series, ...dtoRest }: UpdateSpecializationDto) {
    const specialization = await this.findOne(id);
    const domain = await this.domainsService.findOne(dtoRest.domainId);
    const existingSeries = specialization.series.reduce((acc, series) => ({ ...acc, [series.number]: series }), {} as Record<number, any>);
    const updatedSeries = series.map(number => {
      if(existingSeries[number]) {
        return existingSeries[number];
      }
      return { number };
    });
    return this.specializationsRepository.save({ ...specialization, ...dtoRest, domain, series: updatedSeries });
  }

  async delete(id: string) {
    const specialization = await this.findOne(id);
    return this.specializationsRepository.remove(specialization);
  }

}
