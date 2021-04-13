import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Not, Repository } from "typeorm";
import * as dayjs from "dayjs";
import { getExcerpt, md2html } from "@/utils";
import { BaseService, IPaginate } from "@/base";
import { MetasService } from "../metas/metas.service";
import { UsersService } from "../users/users.service";
import { OptionsService } from "../options/options.service";
import { RelationshipsService } from "../relationships/relationships.service";
import { RelationshipEntity } from "../relationships/entity/relationship.entity";
import { CreateContentDto } from "./dto/create-content.dto";
import { UpdateContentDto } from "./dto/update-content.dto";
import { ContentPageVo, ContentVo } from "./vo/content.vo";
import { ContentEntity } from "./entity/content.entity";

@Injectable()
export class ContentsService extends BaseService<ContentEntity> {
  constructor(
    @InjectRepository(ContentEntity)
    private contentRepo: Repository<ContentEntity>,
    private relationService: RelationshipsService,
    private metaService: MetasService,
    private userService: UsersService,
    private optionService: OptionsService,
    private connection: Connection,
  ) {
    super(contentRepo);
  }

  async create(createContentDto: CreateContentDto) {
    const { slug, date, categories, tags, ...rest } = createContentDto;
    await this.ensureNotExist({ slug }, "文章缩略名已经存在");
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
        cid: created["cid"],
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

  async paginate({ pageIndex, pageSize }): Promise<IPaginate<ContentPageVo>> {
    const { postDateFormat } = await this.optionService.findSiteConfig();
    const format = (timestamp) => dayjs(timestamp).format(postDateFormat || "YYYY-MM-DD");
    const [contents, total] = await this.contentRepo.findAndCount({
      where: { type: "post" },
      order: { cid: "DESC" },
      take: pageSize,
      skip: (pageIndex - 1) * pageSize,
      select: ["cid", "slug", "title", "text", "authorId", "created", "modified"],
    });
    const cids = contents.map((content) => content.cid);
    const userMap = await this.userService.findUserMap();
    const categoryMap = await this.relationService.findContentMetaMapByCids(cids, "category");
    const tagMap = await this.relationService.findContentMetaMapByCids(cids, "tag");
    const items = contents.map((content) => ({
      cid: content.cid,
      slug: content.slug,
      title: content.title,
      excerpt: getExcerpt(content.text),
      authorId: content.authorId,
      authorName: userMap[content.authorId]?.screenName || "",
      categories: categoryMap[content.cid] || [],
      tags: tagMap[content.cid] || [],
      createdAt: format(content.created * 1000),
      modifiedAt: format(content.modified * 1000),
    }));
    return { items, total, pageIndex, pageSize };
  }

  async findById(cid: number): Promise<ContentEntity> {
    const content = await this.ensureExist({ cid }, "文章不存在");
    return content;
  }

  async update(cid: number, dto: UpdateContentDto): Promise<void> {
    const { slug } = dto;
    await this.ensureExist({ cid }, "文章不存在");
    await this.ensureNotExist({ cid, slug: Not(slug) }, "文章缩略名已存在");
    await this.contentRepo.update({ cid }, dto);
    return null;
  }

  async remove(cid: number): Promise<void> {
    await this.ensureExist({ cid }, "文章不存在");
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

  async findPages() {
    const contents = await this.contentRepo.find({
      where: { type: "page" },
      order: { order: "ASC" },
      select: ["cid", "slug", "title"],
    });
    return contents;
  }

  async findByIdOrSlug(input, needHtml?: boolean): Promise<ContentVo> {
    const { postDateFormat } = await this.optionService.findSiteConfig();
    const format = (timestamp) => dayjs(timestamp).format(postDateFormat || "YYYY-MM-DD");
    const content = await this.contentRepo.findOne({
      where: [{ cid: input }, { slug: input }],
      select: ["cid", "slug", "title", "text", "authorId", "created", "modified"],
    });
    return {
      cid: content.cid,
      slug: content.slug,
      title: content.title,
      text: content.text,
      excerpt: getExcerpt(content.text),
      authorId: content.authorId,
      authorName: await this.userService.findScreenNameByUid(content.authorId),
      categories: await this.relationService.findMetasByCid(content.cid, "category"),
      tags: await this.relationService.findMetasByCid(content.cid, "tag"),
      createdAt: format(content.created * 1000),
      modifiedAt: format(content.modified * 1000),
      html: needHtml ? md2html(content.text) : "",
    };
  }
}
