import { Injectable } from "@nestjs/common";
import { RedisService } from "nestjs-redis";
import { OptionsService } from "@/modules/options/options.service";
import { ContentsService } from "@/modules/contents/contents.service";
import { IContent, IPaginate } from "./interface/web.interface";
import { ISharedVars } from "./interface/web.interface";
import { safeParse, safeStringify } from "@/utils";

@Injectable()
export class WebService {
  redis = null;

  constructor(
    private optionService: OptionsService,
    private contentService: ContentsService,
    private redisService: RedisService,
  ) {
    this.redis = redisService.getClient();
  }

  async findSharedVars() {
    const REDIS_KEY = "SharedVars";
    const cache = safeParse(await this.redis.get(REDIS_KEY));
    if (cache) {
      return cache;
    }
    const siteConfig = await this.optionService.findSiteConfig();
    const pages = await this.contentService.findPages();
    const sharedVars: ISharedVars = {
      ...siteConfig,
      pages,
      theme: "default",
    };
    await this.redis.set(REDIS_KEY, safeStringify(sharedVars));
    return sharedVars;
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
    input = input.replace(".html", "");
    const post = await this.contentService.findByIdOrSlug(input, true);
    return post;
  }
}
