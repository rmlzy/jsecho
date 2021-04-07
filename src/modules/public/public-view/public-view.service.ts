import { Injectable } from '@nestjs/common';
import { md2html } from '../../../utils';
import { OptionsService } from '../../options/options.service';
import { ContentsService } from '../../contents/contents.service';
import { IPaginate, IContent } from './interface/public-view.interface';

@Injectable()
export class PublicViewService {
  pages = null;

  constructor(private optionService: OptionsService, private contentService: ContentsService) {}

  async findPages() {
    if (this.pages) {
      return this.pages;
    }
    const pages = await this.contentService.findPages();
    this.pages = pages;
    return pages;
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
