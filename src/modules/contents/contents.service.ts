import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Not, Repository } from 'typeorm';
import { paginateRaw } from 'nestjs-typeorm-paginate';
import { BaseService } from '../../common';
import { ContentEntity, RelationshipEntity, UserEntity } from '../../entities';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { MetasService } from '../metas/metas.service';
import { RelationshipsService } from '../relationships/relationships.service';

@Injectable()
export class ContentsService extends BaseService<ContentEntity> {
  constructor(
    @InjectRepository(ContentEntity)
    private contentRepo: Repository<ContentEntity>,
    private relationService: RelationshipsService,
    private metaService: MetasService,
    private connection: Connection,
  ) {
    super(contentRepo);
  }

  async create(createContentDto: CreateContentDto) {
    const { slug, date, categories, tags, ...rest } = createContentDto;
    await this.ensureNotExist({ slug }, '文章缩略名已经存在');
    const content = {
      ...rest,
      slug, // TODO: 获取下一个ID
      created: this.getTimestamp(date),
      modified: this.getTimestamp(date),
    };
    const categoryMetas = await this.metaService.findCategoryIds(categories);
    const tagMetas = await this.metaService.findTagIds(tags);
    // 事务开始
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      const created = await runner.manager.save(ContentEntity, content);
      const relations = [...categoryMetas, ...tagMetas].map((meta) => ({
        mid: meta.mid,
        cid: created['cid'],
      }));
      await runner.manager.save(RelationshipEntity, relations);
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

  async paginate(options) {
    const { pageIndex, pageSize } = options;
    // TODO: 获取分类
    const contents = this.contentRepo
      .createQueryBuilder('c')
      .orderBy('c.created', 'DESC')
      .leftJoinAndSelect(UserEntity, 'u', 'u.uid = c.authorId')
      .select(['c.*', 'u.screenName as authorName']);
    const rows = await paginateRaw(contents, {
      page: pageIndex,
      limit: pageSize,
    });
    return this.parsePaginateRes(rows);
  }

  async findById(cid: number): Promise<ContentEntity> {
    const content = await this.ensureExist({ cid }, '文章不存在');
    return content;
  }

  async findBySlug(slug: string): Promise<ContentEntity> {
    const content = await this.ensureExist({ slug }, '文章不存在');
    return content;
  }

  async update(cid: number, dto: UpdateContentDto): Promise<void> {
    const { slug } = dto;
    await this.ensureExist({ cid }, '文章不存在');
    await this.ensureNotExist({ cid, slug: Not(slug) }, '文章缩略名已存在');
    await this.contentRepo.update({ cid }, dto);
    return null;
  }

  async remove(cid: number): Promise<void> {
    await this.ensureExist({ cid }, '文章不存在');
    // 事务开始
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      await runner.manager.delete(RelationshipEntity, { cid });
      await runner.manager.delete(ContentEntity, { cid });
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
