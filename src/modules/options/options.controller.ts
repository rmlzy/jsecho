import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OptionsService } from './options.service';

@ApiTags('配置')
@Controller('options')
export class OptionsController {
  constructor(private readonly optionService: OptionsService) {}

  @Get()
  async findAll() {
    const res = await this.optionService.findAll();
    return { statusCode: HttpStatus.OK, message: 'OK', data: res };
  }

  @Get('default')
  async findDefault() {
    const res = await this.optionService.findDefault();
    return { statusCode: HttpStatus.OK, message: 'OK', data: res };
  }
}
