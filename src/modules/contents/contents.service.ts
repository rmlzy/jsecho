import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Content, Relationship } from '../../entities';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { getTimestamp, removeEmptyColumns } from '../../utils';
import { MetasService } from '../metas/metas.service';
import { RelationshipsService } from '../relationships/relationships.service';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content) private contentRepo: Repository<Content>,
    private relationService: RelationshipsService,
    private metaService: MetasService,
    private connection: Connection,
  ) {}

  async findMaxId() {}

  async create(createContentDto: CreateContentDto) {
    const { slug, date, categories, tags, ...rest } = createContentDto;
    const slugExisted = await this.contentRepo.findOne({ where: { slug } });
    if (slugExisted) {
      throw new HttpException('文章缩略名已经存在', 409);
    }
    const timestamp = getTimestamp(date);
    const content = {
      ...rest,
      slug, // 获取下一个ID
      created: timestamp,
      modified: timestamp,
    };
    const categoryMetas = await this.metaService.findCategoryIds(categories);
    const tagMetas = await this.metaService.findTagIds(tags);
    // 事务开始
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      const created = await runner.manager.save(Content, content);
      const relations = [...categoryMetas, ...tagMetas].map((meta) => ({
        mid: meta.mid,
        cid: created['cid'],
      }));
      await runner.manager.save(Relationship, relations);
      await runner.commitTransaction();
    } catch (e) {
      await runner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await runner.release();
    }
    // 事务结束
    return null;
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
    // 事务开始
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      await runner.manager.delete(Relationship, { cid });
      await runner.manager.delete(Content, { cid });
      await runner.commitTransaction();
    } catch (e) {
      await runner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await runner.release();
    }
    // 事务结束
    return null;
  }
}