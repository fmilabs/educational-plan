import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Domain } from './entities/domain.entity';
import { Repository } from 'typeorm';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';


@Injectable()
export class DomainsService {
  constructor(
    @InjectRepository(Domain) private domainsRepository: Repository<Domain>,
  ) {}

  async findAll() {
    return this.domainsRepository.createQueryBuilder('domain')
      .leftJoinAndSelect('domain.specializations', 'specialization')
      .addOrderBy('domain.type', 'ASC')
      .addOrderBy("(CASE WHEN domain.studyForm = 'IF' THEN 0 ELSE 1 END)")
      .addOrderBy('domain.name', 'ASC')
      .addOrderBy('specialization.name', 'ASC')
      .getMany();
  }

  async findOne(id: string) {
    const domain = await this.domainsRepository.findOne({
      where: { id },
      relations: ['specializations'],
      order: { specializations: { name: 'ASC' } },
    });
    if(!domain) {
      throw new NotFoundException(`Domeniul cu ID-ul ${id} nu a fost găsit.`);
    }
    return domain;
  }

  async create(domainDto: CreateDomainDto) {
    return this.domainsRepository.save(domainDto);
  }

  async update(id: string, domainDto: UpdateDomainDto) {
    const domain = await this.findOne(id);
    return this.domainsRepository.save({ ...domain, ...domainDto });
  }

  async delete(id: string) {
    const domain = await this.findOne(id);
    return this.domainsRepository.remove(domain);
  }

}
