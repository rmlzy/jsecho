import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { OptionsService } from '../../options/options.service';
import { ContentsService } from '../../contents/contents.service';
import { PublicViewService } from './public-view.service';
import { IOptions } from '../../../common';

@Controller('')
export class PublicViewController {
  theme = '';
  options: IOptions = {};
  sharedVars = {};

  constructor(
    private optionService: OptionsService,
    private contentService: ContentsService,
    private viewService: PublicViewService,
  ) {
    this.setSharedVars();
  }

  async setSharedVars() {
    const options = await this.optionService.findDefault();
    const pages = await this.contentService.findPages();
    this.theme = 'default';
    this.sharedVars = {
      ...options,
      ...pages,
      layout: `${this.theme}/layout`,
    };
  }

  @Get()
  async home(@Res() res: Response) {
    const pageIndex = 1;
    const posts = await this.viewService.paginatePostsByPageIndex(pageIndex);
    res.render(this.theme, {
      ...this.sharedVars,
      ...posts,
    });
  }

  @Get('page/:pageIndex')
  async page(@Param('pageIndex') pageIndex, @Res() res: Response) {
    const posts = await this.viewService.paginatePostsByPageIndex(+pageIndex);
    return res.render(this.theme, {
      ...this.sharedVars,
      ...posts,
    });
  }

  @Get('blog/:flag')
  async blog(@Param('flag') flag, @Res() res: Response) {}
}
