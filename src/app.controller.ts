import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiExcludeEndpoint()
  @Get()
  @Render('index')
  root() {
    return { message: Date() };
  }
}
