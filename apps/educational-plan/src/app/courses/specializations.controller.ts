import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { SpecializationsService } from './specializations.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';

@Controller('specializations')
// @Roles(Role.Admin)
export class SpecializationsController {
  constructor(private readonly specializationsService: SpecializationsService) {}

  @Post()
  async create(@Body() createSpecializationDto: CreateSpecializationDto) {
    return this.specializationsService.create(createSpecializationDto);
  }

  @Get()
  async findAll() {
    return this.specializationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.specializationsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSpecializationDto: UpdateSpecializationDto) {
    return this.specializationsService.update(id, updateSpecializationDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.specializationsService.delete(id);
  }

}
