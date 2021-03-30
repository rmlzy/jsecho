import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { Meta } from './entities/meta.entity';
import { isXss, removeEmptyColumns } from '../../utils';

@Injectable()
export class MetasService {
  constructor(@InjectRepository(Meta) private metaRepo: Repository<Meta>) {}

  async create(createMetaDto: CreateMetaDto) {
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

  findOne(mid: number) {
    return this.metaRepo.findOne({ where: { mid } });
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
