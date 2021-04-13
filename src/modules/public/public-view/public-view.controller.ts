import { Controller, Get, Param, Res } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { PublicViewService } from "./public-view.service";
import { Reply } from "@/base";

@Controller("")
export class PublicViewController {
  theme = "";
  redis = null;

  constructor(private viewService: PublicViewService) {}

  @ApiExcludeEndpoint()
  @Get("/")
  async home(@Res() reply: Reply) {
    const sharedVars = await this.viewService.findSharedVars();
    const pageIndex = 1;
    const { posts, hasPrevPage, hasNextPage } = await this.viewService.findPosts(pageIndex);
    return reply.view(`${sharedVars.theme}/index`, {
      ...sharedVars,
      hasNextPage,
      hasPrevPage,
      posts,
    });
  }

  @ApiExcludeEndpoint()
  @Get("post/:input")
  async blog(@Param("input") input, @Res() reply) {
    input = input.replace(".html", "");
    const sharedVars = await this.viewService.findSharedVars();
    const post = await this.viewService.findPost(input);
    return reply.view(`${sharedVars.theme}/post`, {
      ...sharedVars,
      post,
    });
  }

  @ApiExcludeEndpoint()
  @Get("page/:input")
  async singlePage(@Param("input") input, @Res() reply) {
    input = input.replace(".html", "");
    const sharedVars = await this.viewService.findSharedVars();
    const page = await this.viewService.findPost(input);
    return reply.view(`${sharedVars.theme}/page`, {
      ...sharedVars,
      page,
    });
  }
}
