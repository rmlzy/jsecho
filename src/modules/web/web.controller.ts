import { Controller, Get, Param, Res } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { Reply } from "@/base";
import { WebService } from "./web.service";

@Controller("")
export class WebController {
  theme = "";
  redis = null;

  constructor(private webService: WebService) {}

  @ApiExcludeEndpoint()
  @Get("/")
  async home(@Res() reply: Reply) {
    const sharedVars = await this.webService.findSharedVars();
    const pageIndex = 1;
    const { posts, hasPrevPage, hasNextPage } = await this.webService.findPosts(pageIndex);
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
    const sharedVars = await this.webService.findSharedVars();
    const post = await this.webService.findPost(input);
    return reply.view(`${sharedVars.theme}/post`, {
      ...sharedVars,
      post,
    });
  }

  @ApiExcludeEndpoint()
  @Get("page/:input")
  async singlePage(@Param("input") input, @Res() reply) {
    input = input.replace(".html", "");
    const sharedVars = await this.webService.findSharedVars();
    const page = await this.webService.findPost(input);
    return reply.view(`${sharedVars.theme}/page`, {
      ...sharedVars,
      page,
    });
  }
}
