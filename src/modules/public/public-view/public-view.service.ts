import { Injectable, Scope } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { OptionsService } from '../../options/options.service';
import { ContentsService } from '../../contents/contents.service';
import { getExcerpt, IOptions } from '../../../common';
import { IPaginate, IContent } from './public-view.interface';

@Injectable({ scope: Scope.REQUEST })
export class PublicViewService {
  options: IOptions = {};

  constructor(private optionService: OptionsService, private contentService: ContentsService) {
    this.optionService.findDefault().then((options) => {
      this.options = options;
    });
  }

  async paginatePostsByPageIndex(pageIndex): Promise<IPaginate<IContent>> {
    const { pageSize, postDateFormat } = this.options;
    const res = await this.contentService.paginate({ pageIndex, pageSize: +pageSize });
    const posts = res.items.map((content) => {
      const { title, slug, text, authorId, authorName, categories, tags } = content;
      return {
        title,
        slug,
        excerpt: getExcerpt(text),
        authorId,
        authorName,
        categories,
        tags,
        createdAt: dayjs(content.created * 1000).format(postDateFormat || 'YYYY-MM-DD'),
        modifiedAt: dayjs(content.modified * 1000).format(postDateFormat || 'YYYY-MM-DD'),
      };
    });
    return {
      maxPage: 10,
      pageIndex,
      posts,
    };
  }
}
