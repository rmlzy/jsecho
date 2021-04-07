import { Controller, Get, Param, Res, CacheTTL } from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { ONE_HOUR } from '../../../constants';
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
      layout: `${this.theme}/layout`,
      pages,
    };
  }

  @ApiExcludeEndpoint()
  @CacheTTL(ONE_HOUR) // TODO: 似乎不工作
  @Get()
  async home(@Res() res: Response) {
    await this.ensureSharedVars();
    const pageIndex = 1;
    const { posts, hasPrevPage, hasNextPage } = await this.viewService.findPosts(pageIndex);
    res.render(`${this.theme}/index`, {
      ...this.sharedVars,
      hasNextPage,
      hasPrevPage,
      posts,
    });
  }

  @ApiExcludeEndpoint()
  @CacheTTL(ONE_HOUR)
  @Get('page/:pageIndex.html')
  async blogList(@Param('pageIndex') pageIndex, @Res() res: Response) {
    await this.ensureSharedVars();
    const { posts, hasPrevPage, hasNextPage } = await this.viewService.findPosts(+pageIndex);
    return res.render(`${this.theme}/index`, {
      ...this.sharedVars,
      hasNextPage,
      hasPrevPage,
      posts,
    });
  }

  @ApiExcludeEndpoint()
  @CacheTTL(ONE_HOUR)
  @Get('post/:input.html')
  async blog(@Param('input') input, @Res() res: Response) {
    await this.ensureSharedVars();
    const post = await this.viewService.findPost(input);
    return res.render(`${this.theme}/post`, {
      ...this.sharedVars,
      post,
    });
  }

  @ApiExcludeEndpoint()
  @CacheTTL(ONE_HOUR)
  @Get(':input.html')
  async singlePage(@Param('input') input, @Res() res: Response) {
    await this.ensureSharedVars();
    const page = await this.viewService.findPost(input);
    return res.render(`${this.theme}/page`, {
      ...this.sharedVars,
      page,
    });
  }
}
