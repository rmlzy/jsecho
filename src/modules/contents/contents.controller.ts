import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  async create(@Body() createContentDto: CreateContentDto) {
    const res = await this.contentsService.create(createContentDto);
    return { statusCode: HttpStatus.OK, message: 'OK', data: res };
  }

  @Get()
  async findAll() {
    const res = await this.contentsService.findAll();
    return { statusCode: HttpStatus.OK, message: 'OK', data: res };
  }

  @Get(':cid')
  async findOne(@Param('cid') cid: string) {
    const res = await this.contentsService.findById(+cid);
    return { statusCode: HttpStatus.OK, message: 'OK', data: res };
  }

  @Patch(':cid')
  async update(
    @Param('cid') cid: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    const res = await this.contentsService.update(+cid, updateContentDto);
    return { statusCode: HttpStatus.OK, message: 'OK', data: res };
  }

  @Delete(':cid')
  async remove(@Param('cid') cid: string) {
    const res = await this.contentsService.remove(+cid);
    return { statusCode: HttpStatus.OK, message: 'OK', data: res };
  }
}
