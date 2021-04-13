import { Injectable } from "@nestjs/common";
import { RedisService } from "nestjs-redis";
import { OptionService } from "@/modules/option/option.service";
import { ContentService } from "@/modules/content/content.service";
import { IContent, IPaginate } from "./web.interface";
import { ISharedVars } from "./web.interface";
import { safeParse, safeStringify } from "@/utils";

@Injectable()
export class WebService {
  redis = null;

  constructor(
    private optionService: OptionService,
    private contentService: ContentService,
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
    const hasPrevPage = pageIndex > 1;
    const hasNextPage = pageIndex * Number(pageSize) < total;
    return {
      hasPrevPage,
      hasNextPage,
      posts: items,
    };
  }

  async findPost(input) {
    input = input.replace(".html", "");
    const post = await this.contentService.findByIdOrSlug(input, true);
    return post;
  }
}
