import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { RedisService } from "nestjs-redis";
import { Reply } from "@/base";
import { safeParse, safeStringify } from "@/utils";
import { WebService } from "./web.service";
import { ISharedVars } from "./web.interface";

@Controller("")
export class WebController {
  sharedVars: ISharedVars = {
    theme: "default",
  };
  redis = null;

  constructor(private webService: WebService, private redisService: RedisService) {
    this.redis = this.redisService.getClient();
    this.webService.findSharedVars().then((vars) => {
      this.sharedVars = vars;
    });
  }

  private async findPostsByPageIndex(pageIndex) {
    pageIndex = Number(pageIndex);
    const { posts, hasPrevPage, hasNextPage } = await this.webService.findPosts(pageIndex);
    return {
      ...this.sharedVars,
      prevPageIndex: hasPrevPage ? pageIndex - 1 : 0,
      nextPageIndex: hasNextPage ? pageIndex + 1 : 0,
      posts,
    };
  }

  @ApiExcludeEndpoint()
  @Get("/")
  async renderHome(@Req() req, @Res() reply: Reply) {
    const cache = safeParse(await this.redis.get(req.url));
    if (cache) {
      return reply.view(`${this.sharedVars.theme}/index`, cache);
    }
    const pageIndex = 1;
    const data = await this.findPostsByPageIndex(pageIndex);
    await this.redis.set(req.url, safeStringify(data));
    return reply.view(`${this.sharedVars.theme}/index`, data);
  }

  @ApiExcludeEndpoint()
  @Get("/p/:pageIndex")
  async renderPaginate(@Req() req, @Param("pageIndex") pageIndex, @Res() reply: Reply) {
    const cache = safeParse(await this.redis.get(req.url));
    if (cache) {
      return reply.view(`${this.sharedVars.theme}/index`, cache);
    }
    const data = await this.findPostsByPageIndex(pageIndex);
    await this.redis.set(req.url, safeStringify(data));
    return reply.view(`${this.sharedVars.theme}/index`, data);
  }

  @ApiExcludeEndpoint()
  @Get("post/:input")
  async renderPost(@Req() req, @Param("input") input, @Res() reply) {
    const cache = safeParse(await this.redis.get(req.url));
    if (cache) {
      return reply.view(`${this.sharedVars.theme}/post`, cache);
    }
    const post = await this.webService.findPost(input);
    const data = {
      ...this.sharedVars,
      post,
    };
    await this.redis.set(req.url, safeStringify(data));
    return reply.view(`${this.sharedVars.theme}/post`, data);
  }

  @ApiExcludeEndpoint()
  @Get("page/:input")
  async renderPage(@Req() req, @Param("input") input, @Res() reply) {
    const cache = safeParse(await this.redis.get(req.url));
    if (cache) {
      return reply.view(`${this.sharedVars.theme}/page`, cache);
    }
    const page = await this.webService.findPost(input);
    const data = {
      ...this.sharedVars,
      page,
    };
    await this.redis.set(req.url, safeStringify(data));
    return reply.view(`${this.sharedVars.theme}/page`, data);
  }

  @Get("/404")
  async render404(@Res() reply) {
    return reply.view(`${this.sharedVars.theme}/404`);
  }
}
