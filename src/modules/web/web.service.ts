import { Injectable } from "@nestjs/common";
import { RedisService } from "nestjs-redis";
import { OptionsService } from "@/modules/options/options.service";
import { ContentsService } from "@/modules/contents/contents.service";
import { IContent, IPaginate } from "./interface/web.interface";

@Injectable()
export class WebService {
  sharedVars = null;

  constructor(
    private optionService: OptionsService,
    private contentService: ContentsService,
    private redisService: RedisService,
  ) {}

  async findSharedVars() {
    // const redis = await this.redisService.getClient();
    // const sharedVars = await redis.get("sharedVars");
    // if (sharedVars) {
    //   return JSON.parse(sharedVars);
    // }

    const siteConfig = await this.optionService.findSiteConfig();
    const pages = await this.contentService.findPages();
    const vars = {
      ...siteConfig,
      pages,
      theme: "default",
    };
    // await redis.set("sharedVars", JSON.stringify(sharedVars));
    return vars;
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
