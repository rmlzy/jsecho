import { Injectable, Scope } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { OptionsService } from '../../options/options.service';
import { ContentsService } from '../../contents/contents.service';
import { getExcerpt, IOptions, md2html } from '../../../common';
import { IPaginate, IContent } from './public-view.interface';

@Injectable({ scope: Scope.REQUEST })
export class PublicViewService {
  options: IOptions = null;
  pages = null;

  constructor(private optionService: OptionsService, private contentService: ContentsService) {}

  async findSiteConfig() {
    if (this.options) {
      return this.options;
    }
    const options = await this.optionService.findDefault();
    this.options = options;
    return options;
  }

  async findPages() {
    if (this.pages) {
      return this.pages;
    }
    const pages = await this.contentService.findPages();
    this.pages = pages;
    return pages;
  }

  async findPosts(pageIndex): Promise<IPaginate<IContent>> {
    const { pageSize, postDateFormat } = await this.findSiteConfig();
    const format = (timestamp) => dayjs(timestamp).format(postDateFormat || 'YYYY-MM-DD');
    const { posts, total } = await this.contentService.findPosts({
      pageIndex,
      pageSize: +pageSize,
    });
    return {
      hasPrevPage: true,
      hasNextPage: true,
      posts: posts.map((post) => {
        const { cid, title, slug, text, created, modified } = post;
        return {
          cid,
          title,
          slug,
          excerpt: getExcerpt(text),
          createdAt: format(created),
          modifiedAt: format(modified),
        };
      }),
    };
  }

  async findBlog(input) {
    const blog = await this.contentService.findByIdOrSlug(input);
    if (blog) {
      blog['html'] = md2html(blog.text);
    }
    return blog;
  }
}
