import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { DomainsService } from './domains.service';

@Controller('domains')
// @Roles(Role.Admin)
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Post()
  async create(@Body() createDomainDto: CreateDomainDto) {
    return this.domainsService.create(createDomainDto);
  }

  @Get()
  async findAll() {
    return this.domainsService.findAll();
  }

  @Get(':id')
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
