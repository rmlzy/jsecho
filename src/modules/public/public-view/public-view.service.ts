import { Injectable } from '@nestjs/common';
import { md2html } from '../../../utils';
import { OptionsService } from '../../options/options.service';
import { ContentsService } from '../../contents/contents.service';
import { IPaginate, IContent } from './interface/public-view.interface';

@Injectable()
export class PublicViewService {
  sharedVars = null;

  constructor(private optionService: OptionsService, private contentService: ContentsService) {}

  async findSharedVars() {
    const siteConfig = await this.optionService.findSiteConfig();
    const pages = await this.contentService.findPages();
    return {
      ...siteConfig,
      pages,
      theme: 'default',
    };
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
