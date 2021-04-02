import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OptionEntity } from '../../entities';
import { BaseService, optionsToMap } from '../../common';

@Injectable()
export class OptionsService extends BaseService<OptionEntity> {
  userId = 1;

  constructor(
    @InjectRepository(OptionEntity)
    private optionRepo: Repository<OptionEntity>,
  ) {
    super(optionRepo);
  }

  findAll(): Promise<OptionEntity[]> {
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
}
