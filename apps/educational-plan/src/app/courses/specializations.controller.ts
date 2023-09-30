import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { SpecializationsService } from './specializations.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@educational-plan/types';
import { Public } from '../auth/decorators/public.decorator';

@Controller('specializations')
@Roles(Role.Admin)
export class SpecializationsController {
  constructor(private readonly specializationsService: SpecializationsService) {}

  @Post()
  async create(@Body() createSpecializationDto: CreateSpecializationDto) {
    return this.specializationsService.create(createSpecializationDto);
  }

  @Get()
  @Roles()
  @Public()
  async findAll() {
    return this.specializationsService.findAll();
  }

  @Get(':id')
  @Roles()
  @Public()
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
