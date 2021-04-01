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
import { LoggedGuard, Roles } from '../../guards';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @UseGuards(LoggedGuard)
  @Roles(['administrator', 'editor', 'contributor'])
  @Post()
  async create(@Body() createContentDto: CreateContentDto) {
    const res = await this.contentsService.create(createContentDto);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @UseGuards(LoggedGuard)
  @Roles(['administrator', 'editor', 'contributor'])
  @Get()
  async paginate(@Query() query) {
    const res = await this.contentsService.paginate(query);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @UseGuards(LoggedGuard)
  @Roles(['administrator', 'editor', 'contributor'])
  @Get(':cid')
  async findOne(@Param('cid') cid: string) {
    const res = await this.contentsService.findById(+cid);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @UseGuards(LoggedGuard)
  @Roles(['administrator', 'editor', 'contributor'])
  @Patch(':cid')
  async update(
    @Param('cid') cid: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    const res = await this.contentsService.update(+cid, updateContentDto);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @UseGuards(LoggedGuard)
  @Roles(['administrator', 'editor', 'contributor'])
  @Delete(':cid')
  async remove(@Param('cid') cid: string) {
    const res = await this.contentsService.remove(+cid);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }
}
