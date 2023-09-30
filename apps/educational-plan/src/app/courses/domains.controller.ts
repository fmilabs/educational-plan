import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { DomainsService } from './domains.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@educational-plan/types';
import { Public } from '../auth/decorators/public.decorator';

@Controller('domains')
@Roles(Role.Admin)
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Post()
  async create(@Body() createDomainDto: CreateDomainDto) {
    return this.domainsService.create(createDomainDto);
  }

  @Get()
  @Roles()
  @Public()
  async findAll() {
    return this.domainsService.findAll();
  }

  @Get(':id')
  @Roles()
  @Public()
  async findOne(@Param('id') id: string) {
    return this.domainsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDomainDto: UpdateDomainDto) {
    return this.domainsService.update(id, updateDomainDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.domainsService.delete(id);
  }

}
