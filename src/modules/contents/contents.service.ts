import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Not, Repository } from 'typeorm';
import { keyBy } from 'lodash';
import { BaseService, ICategory, IPaginate } from '../../common';
import { ContentEntity, RelationshipEntity } from '../../entities';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { MetasService } from '../metas/metas.service';
import { RelationshipsService } from '../relationships/relationships.service';
import { UsersService } from '../users/users.service';

export interface IContent extends ContentEntity {
  authorName: string;
  tags: string[];
  categories: ICategory[];
}

@Injectable()
export class ContentsService extends BaseService<ContentEntity> {
  constructor(
    @InjectRepository(ContentEntity)
    private contentRepo: Repository<ContentEntity>,
    private relationService: RelationshipsService,
    private metaService: MetasService,
    private userService: UsersService,
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

  async paginate(options): Promise<IPaginate<IContent>> {
    const pageIndex: number = options.pageIndex;
    const pageSize: number = options.pageSize;
    const [contents, total] = await this.contentRepo.findAndCount({
      where: { type: Not('page') },
      order: { modified: 'DESC' },
      take: pageSize,
      skip: (pageIndex - 1) * pageSize,
    });
    const cids = contents.map((content) => content.cid);
    const authorIds = contents.map((content) => content.authorId);
    const authors = keyBy(await this.userService.findByUids(authorIds), 'uid');
    const categoryMap = await this.relationService.findCategoriesByCids(cids);
    const items = contents.map((content) => {
      const categories = categoryMap[content.cid];
      content['authorName'] = authors[content.authorId]?.screenName || '';
      content['categories'] = categories || [];
      return content as IContent;
    });
    return {
      items,
      total,
      pageIndex,
      pageSize,
    };
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

  async findPosts({ pageIndex, pageSize }) {
    const [posts, total] = await this.contentRepo.findAndCount({
      where: { type: 'post' },
      order: { cid: 'DESC' },
      select: ['cid', 'slug', 'title', 'text', 'created', 'modified'],
      take: pageSize,
      skip: (pageIndex - 1) * pageSize,
    });
    return { posts, total };
  }

  async findPages() {
    const pages = await this.contentRepo.find({
      where: { type: 'page' },
      select: ['cid', 'slug', 'title'],
    });
    return pages;
  }

  async findByIdOrSlug(input) {
    const content = await this.contentRepo.findOne({
      where: [{ cid: input }, { slug: input }],
    });
    return content;
  }
}
