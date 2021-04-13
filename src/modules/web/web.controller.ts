import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { Reply } from "@/base";
import { WebService } from "./web.service";
import { ISharedVars } from "./web.interface";
import { RedisService } from "nestjs-redis";
import { safeParse, safeStringify } from "@/utils";

@Controller("")
export class WebController {
  sharedVars: ISharedVars = {};
  redis = null;

  constructor(private webService: WebService, private redisService: RedisService) {
    this.redis = this.redisService.getClient();
    this.webService.findSharedVars().then((vars) => {
      this.sharedVars = vars;
    });
  }

  @ApiExcludeEndpoint()
  @Get("/")
  async home(@Req() req, @Res() reply: Reply) {
    const cache = safeParse(await this.redis.get(req.url));
    if (cache) {
      return reply.view(`${this.sharedVars.theme}/index`, cache);
    }
    const { posts, hasPrevPage, hasNextPage } = await this.webService.findPosts(1);
    const data = {
      ...this.sharedVars,
      hasNextPage,
      hasPrevPage,
      posts,
    };
    await this.redis.set(req.url, safeStringify(data));
    return reply.view(`${this.sharedVars.theme}/index`, data);
  }

  @ApiExcludeEndpoint()
  @Get("post/:input")
  async blog(@Req() req, @Param("input") input, @Res() reply) {
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
  async singlePage(@Req() req, @Param("input") input, @Res() reply) {
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
}
