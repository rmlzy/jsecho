import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { BaseService } from "@/base";
import { optionsToMap, getGenerator } from "@/utils";
import { OptionEntity } from "./entity/option.entity";
import { IOptions } from "./interface/option.interface";

@Injectable()
export class OptionsService extends BaseService<OptionEntity> {
  userId = 1;
  options: IOptions = null;

  constructor(
    @InjectRepository(OptionEntity)
    private optionRepo: Repository<OptionEntity>,
    private connection: Connection,
  ) {
    super(optionRepo);
  }

  async overrideTypechoConfig() {
    const configs = [
      { name: "generator", value: getGenerator() },
      { name: "postDateFormat", value: "YYYY年MM月DD日" },
      { name: "commentDateFormat", value: "YYYY年MM月DD日 HH:mm:ss" },
    ];
    for (let i = 0; i < configs.length; i++) {
      const config = configs[i];
      await this.optionRepo.update(
        { user: 0, name: config.name },
        {
          value: config.value,
        },
      );
    }
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
    options.generator = getGenerator();
    this.options = options;
    return options;
  }

  async findByUid(uid: number): Promise<IOptions> {
    const options = await this.optionRepo.find({ where: { user: uid } });
    return optionsToMap(options);
  }
}
