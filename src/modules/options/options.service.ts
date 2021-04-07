import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../base';
import { optionsToMap } from '../../utils';
import { OptionEntity } from './entity/option.entity';
import { IOptions } from './interface/option.interface';

@Injectable()
export class OptionsService extends BaseService<OptionEntity> {
  userId = 1;
  options: IOptions = null;

  constructor(
    @InjectRepository(OptionEntity)
    private optionRepo: Repository<OptionEntity>,
  ) {
    super(optionRepo);
  }

  findAll(): Promise<OptionEntity[]> {
    return this.optionRepo.find();
  }

  async findDefault(): Promise<IOptions> {
    const options = await this.optionRepo.find({ where: { user: 0 } });
    return optionsToMap(options);
  }

  async findSiteConfig() {
    if (this.options) {
      return this.options;
    }
    const options = await this.findDefault();
    this.options = options;
    return options;
  }

  async findByUid(uid: number): Promise<IOptions> {
    const options = await this.optionRepo.find({ where: { user: uid } });
    return optionsToMap(options);
  }
}
