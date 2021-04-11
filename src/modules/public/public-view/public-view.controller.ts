import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { OptionsService } from '../../options/options.service';
import { PublicViewService } from './public-view.service';

@Controller('')
export class PublicViewController {
  theme = '';
  sharedVars = {};

  constructor(private viewService: PublicViewService, private optionService: OptionsService) {}

  private async ensureSharedVars() {
    if (this.theme) return;
    const siteConfig = await this.optionService.findSiteConfig();
    const pages = await this.viewService.findPages();
    this.theme = 'default';
    this.sharedVars = {
      ...siteConfig,
      pages,
    };
  }

  @ApiExcludeEndpoint()
  @Get()
  async home(@Res() reply) {
    await this.ensureSharedVars();
    const pageIndex = 1;
    const { posts, hasPrevPage, hasNextPage } = await this.viewService.findPosts(pageIndex);
    reply.view(`${this.theme}/index`, {
      ...this.sharedVars,
      hasNextPage,
      hasPrevPage,
      posts,
    });
  }

  @ApiExcludeEndpoint()
  @Get('page/:pageIndex')
  async blogList(@Param('pageIndex') pageIndex, @Res() reply) {
    pageIndex = pageIndex.replace('.html', '');
    await this.ensureSharedVars();
    const { posts, hasPrevPage, hasNextPage } = await this.viewService.findPosts(+pageIndex);
    return reply.view(`${this.theme}/index`, {
      ...this.sharedVars,
      hasNextPage,
      hasPrevPage,
      posts,
    });
  }

  @ApiExcludeEndpoint()
  @Get('post/:input')
  async blog(@Param('input') input, @Res() reply) {
    input = input.replace('.html', '');
    await this.ensureSharedVars();
    const post = await this.viewService.findPost(input);
    return reply.view(`${this.theme}/post`, {
      ...this.sharedVars,
      post,
    });
  }

  @ApiExcludeEndpoint()
  @Get(':input')
  async singlePage(@Param('input') input, @Res() reply) {
    input = input.replace('.html', '');
    await this.ensureSharedVars();
    const page = await this.viewService.findPost(input);
    console.log(page);
    return reply.view(`${this.theme}/page`, {
      ...this.sharedVars,
      page,
    });
  }
}
