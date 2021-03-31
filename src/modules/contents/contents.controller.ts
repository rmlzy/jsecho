import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { JwtAuthGuard } from '../auth/jwt-guard';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createContentDto: CreateContentDto) {
    const res = await this.contentsService.create(createContentDto);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async paginate(@Query() query) {
    const res = await this.contentsService.paginate(query);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @Get(':cid')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('cid') cid: string) {
    const res = await this.contentsService.findById(+cid);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @Patch(':cid')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('cid') cid: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    const res = await this.contentsService.update(+cid, updateContentDto);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @Delete(':cid')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('cid') cid: string) {
    const res = await this.contentsService.remove(+cid);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }
}
