import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { Meta } from '../../entities';
import { isXss, removeEmptyColumns } from '../../utils';

@Injectable()
export class MetasService {
  constructor(@InjectRepository(Meta) private metaRepo: Repository<Meta>) {}

  async create(createMetaDto: CreateMetaDto): Promise<void> {
    const { name, slug, parent, description } = createMetaDto;
    if (isXss(name)) {
      throw new HttpException('请不要在分类名称中使用特殊字符', 409);
    }
    const nameExisted = await this.metaRepo.findOne({ where: { name } });
    if (nameExisted) {
      throw new HttpException('分类名称已经存在', 409);
    }
    const slugExisted = await this.metaRepo.findOne({ where: { slug } });
    if (slugExisted) {
      throw new HttpException('分类缩写名已经存在', 409);
    }
    const created = await this.metaRepo.save({
      name,
      slug,
      type: 'category',
      description,
      count: 0,
      order: 0,
      parent,
    });
    return null;
  }

  findAll(): Promise<Meta[]> {
    return this.metaRepo.find();
  }

  findById(mid: number) {
    return this.metaRepo.findOne({ where: { mid } });
  }

  /**
   * 通过分类ID查询, 无则跳过
   */
  async findCategoryIds(ids): Promise<Meta[]> {
    const metas = [];
    for (let i = 0; i < ids.length; i++) {
      const meta = await this.metaRepo.findOne({
        where: { mid: ids[i], type: 'category' },
      });
      if (meta) {
        metas.push(meta);
      }
    }
    return metas;
  }

  /**
   * 通过标签名称查询, 无则创建
   */
  async findTagIds(names): Promise<Meta[]> {
    const metas = [];
    for (let i = 0; i < names.length; i++) {
      const existed = await this.metaRepo.findOne({
        where: { name: names[i], type: 'tag' },
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

  /**
   * 通过名称默认创建
   */
  private async createTagByName(name): Promise<Meta> {
    const meta = new Meta();
    meta.name = name;
    meta.slug = name;
    meta.type = 'tag';
    meta.description = '';
    meta.count = 1;
    const created = await this.metaRepo.save(meta);
    return created;
  }

  async update(mid: number, updateMetaDto: UpdateMetaDto) {
    const existed = await this.metaRepo.findOne({ mid });
    if (!existed) {
      throw new HttpException('资源不存在', 404);
    }
    await this.metaRepo.update({ mid }, removeEmptyColumns(updateMetaDto));
    return null;
  }

  async remove(mid: number) {
    const existed = await this.metaRepo.findOne({ mid });
    if (!existed) {
      throw new HttpException('资源不存在', 404);
    }
    // TODO: 校验当前用户权限
    const removed = await this.metaRepo.delete({ mid });
    return null;
  }
}
