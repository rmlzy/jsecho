import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { RedisService } from 'nestjs-redis';
import { OptionsService } from '../../options/options.service';
import { PublicViewService } from './public-view.service';
import { Reply } from '../../../base';

@Controller('')
export class PublicViewController {
  theme = '';
  sharedVars = {};
  redis = null;

  constructor(
    private viewService: PublicViewService,
    private optionService: OptionsService,
    private redisService: RedisService,
  ) {}

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

  private async getCacheByName(name) {
    const redis = await this.redisService.getClient();
    const cache = await redis.get(name);
    if (cache) {
      console.log('Use Redis Cache');
    }
    return cache;
  }

  @ApiExcludeEndpoint()
  @Get()
  async home(@Res() reply: Reply) {
    const cache = await this.getCacheByName('home.html');
    if (cache) {
      return cache;
    }

    await this.ensureSharedVars();
    const pageIndex = 1;
    const { posts, hasPrevPage, hasNextPage } = await this.viewService.findPosts(pageIndex);
    // TODO: 缓存到 REDIS
    return reply.view(`${this.theme}/index`, {
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
    return reply.view(`${this.theme}/page`, {
      ...this.sharedVars,
      page,
    });
  }
}
