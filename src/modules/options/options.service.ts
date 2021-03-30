import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option } from './entities/option.entity';
import { optionsToMap } from '../../utils';

@Injectable()
export class OptionsService {
  userId = 1;

  constructor(
    @InjectRepository(Option) private optionRepo: Repository<Option>,
  ) {}

  create(createOptionDto: CreateOptionDto) {}

  findAll(): Promise<Option[]> {
    return this.optionRepo.find();
  }

  async findDefault() {
    const options = await this.optionRepo.find({ where: { user: 0 } });
    return optionsToMap(options);
  }

  async findByUid(uid: number) {
    const options = await this.optionRepo.find({ where: { user: uid } });
    return optionsToMap(options);
  }

  update(updateOptionDto: UpdateOptionDto) {}

  remove({ name, user }) {}
}
