import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';
import { OptionsService } from '../../options/options.service';

@Controller('')
export class PublicViewController {
  theme = '';

  constructor(private optionService: OptionsService) {
    this.optionService.findDefault().then((options) => {
      if (options['theme'] === 'typecho-poppython') {
        this.theme = 'default';
      } else {
        this.theme = options['theme'];
      }
    });
  }

  @ApiExcludeEndpoint()
  @Get()
  root(@Res() res: Response) {
    return res.render(this.theme, { message: 'Hello world!' });
  }
}
