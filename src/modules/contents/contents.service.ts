import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { removeEmptyColumns } from '../../utils';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content) private contentRepo: Repository<Content>,
  ) {}

  create(createContentDto: CreateContentDto) {
    return 'This action adds a new content';
  }

  findAll() {
    return this.contentRepo.find();
  }

  findById(cid: number) {
    return this.contentRepo.find({ where: { cid } });
  }

  findBySlug(slug: string) {
    return this.contentRepo.find({ where: { slug } });
  }

  async update(cid: number, updateContentDto: UpdateContentDto) {
    const existed = await this.contentRepo.findOne({ cid });
    if (!existed) {
      throw new HttpException('资源不存在', 404);
    }
    await this.contentRepo.update(
      { cid },
      removeEmptyColumns(updateContentDto),
    );
    return null;
  }

  async remove(cid: number) {
    const existed = await this.contentRepo.findOne({ cid });
    if (!existed) {
      throw new HttpException('资源不存在', 404);
    }
    // TODO: 校验当前用户权限
    const removed = await this.contentRepo.delete({ cid });
    return null;
  }
}
