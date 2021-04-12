import { Injectable } from '@nestjs/common';
import { md2html } from '../../../utils';
import { OptionsService } from '../../options/options.service';
import { ContentsService } from '../../contents/contents.service';
import { IPaginate, IContent } from './interface/public-view.interface';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class PublicViewService {
  sharedVars = null;

  constructor(
    private optionService: OptionsService,
    private contentService: ContentsService,
    private redisService: RedisService,
  ) {}

  async findSharedVars() {
    const redis = await this.redisService.getClient();
    const sharedVars = await redis.get('sharedVars');
    if (sharedVars) {
      return JSON.parse(sharedVars);
    }

    const siteConfig = await this.optionService.findSiteConfig();
    const pages = await this.contentService.findPages();
    const vars = {
      ...siteConfig,
      pages,
      theme: 'default',
    };
    await redis.set('sharedVars', JSON.stringify(sharedVars));
    return vars;
  }

  async findPosts(pageIndex): Promise<IPaginate<IContent>> {
    const { pageSize } = await this.optionService.findSiteConfig();
    const { items, total } = await this.contentService.paginate({
      pageIndex,
      pageSize: +pageSize,
    });
    return {
      hasPrevPage: true,
      hasNextPage: true,
      posts: items,
    };
  }

  async findPost(input) {
    const post = await this.contentService.findByIdOrSlug(input, true);
    return post;
  }
}
