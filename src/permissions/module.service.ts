import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Module } from './entities/module.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { CommonServices } from 'src/common-services/common-services.service';

@Injectable()
export class ModulesService {
  constructor(
    @Inject('MODULE_REPOSITORY')
    private readonly moduleRepository: Repository<Module>,
    private readonly commonService: CommonServices,
  ) {}

  async create(createModuleDto: CreateModuleDto) {
    await this.commonService.checkForDuplicateFields(this.moduleRepository, [
      { field: 'name', value: createModuleDto.name },
    ]);
    return await this.moduleRepository.save(createModuleDto);
  }

  async findAll() {
    return await this.moduleRepository.find();
  }

  async findOne(id: number) {
    return await this.moduleRepository.findOneBy({ id });
  }

  async update(updateModuleDto: UpdateModuleDto) {
    return await this.moduleRepository.update(
      { id: updateModuleDto.id },
      updateModuleDto,
    );
  }

  async remove(id: number) {
    return await this.moduleRepository.delete(id);
  }
}
