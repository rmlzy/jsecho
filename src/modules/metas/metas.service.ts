import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { keyBy } from "lodash";
import { BaseService, IPaginate } from "@/base";
import { isNotXss, removeEmptyColumns } from "@/utils";
import { IMetaType } from "./interface/meta.interface";
import { MetaEntity } from "./entity/meta.entity";
import { CreateMetaDto } from "./dto/create-meta.dto";
import { UpdateMetaDto } from "./dto/update-meta.dto";
import { MetaMapVo } from "./vo/meta.vo";

@Injectable()
export class MetasService extends BaseService<MetaEntity> {
  constructor(@InjectRepository(MetaEntity) private metaRepo: Repository<MetaEntity>) {
    super(metaRepo);
  }

  async create(createMetaDto: CreateMetaDto): Promise<void> {
    const { name, slug, parent, description } = createMetaDto;
    this.asset(isNotXss(name), "请不要在分类名称中使用特殊字符");
    await this.ensureNotExist({ name }, "分类名称已经存在");
    await this.ensureNotExist({ slug }, "分类缩写名已经存在");
    await this.metaRepo.save({
      name,
      slug,
      type: "category",
      description,
      count: 0,
      order: 0,
      parent,
    });
    return null;
  }

  async paginate({ pageIndex, pageSize, type }): Promise<IPaginate<MetaEntity>> {
    const [metas, total] = await this.metaRepo.findAndCount({
      where: { type },
      order: { mid: "DESC" },
      take: pageSize,
      skip: (pageIndex - 1) * pageSize,
    });
    return {
      items: metas,
      total,
      pageIndex,
      pageSize,
    };
  }

  async findById(mid: number): Promise<MetaEntity> {
    const meta = await this.ensureExist({ mid }, "分类不存在");
    return meta;
  }

  async findMetaMapByMids(mids: number[], type: IMetaType): Promise<MetaMapVo> {
    const metas = await this.metaRepo.find({
      where: { mid: In(mids), type },
      select: ["mid", "name", "slug"],
    });
    return keyBy(metas, "mid");
  }

  async findCategoryIds(ids): Promise<MetaEntity[]> {
    const metas = [];
    for (let i = 0; i < ids.length; i++) {
      const meta = await this.metaRepo.findOne({
        where: { mid: ids[i], type: "category" },
      });
      if (meta) {
        metas.push(meta);
      }
    }
    return metas;
  }

  async findTagIds(names): Promise<MetaEntity[]> {
    const metas = [];
    for (let i = 0; i < names.length; i++) {
      const existed = await this.metaRepo.findOne({
        where: { name: names[i], type: "tag" },
      });
      if (existed) {
        metas.push(existed);
      } else {
        try {
          const created = await this.createTagByName(names[i]);
          metas.push(created);
        } catch (e) {
          // pass
        }
      }
    }
    return metas;
  }

  async update(mid: number, updateMetaDto: UpdateMetaDto): Promise<void> {
    await this.ensureExist({ mid }, "资源不存在");
    await this.metaRepo.update({ mid }, removeEmptyColumns(updateMetaDto));
    return null;
  }

  async remove(mid: number): Promise<void> {
    await this.ensureExist({ mid }, "资源不存在");
    await this.metaRepo.delete({ mid });
    return null;
  }

  private async createTagByName(name): Promise<MetaEntity> {
    const meta = new MetaEntity();
    meta.name = name;
    meta.slug = name;
    meta.type = "tag";
    meta.description = "";
    meta.count = 1;
    const created = await this.metaRepo.save(meta);
    return created;
  }
}
