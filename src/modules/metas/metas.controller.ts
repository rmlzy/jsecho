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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MetasService } from './metas.service';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';

@ApiTags('分类')
@Controller('metas')
export class MetasController {
  constructor(private readonly metasService: MetasService) {}

  @ApiOperation({ description: '创建分类' })
  @Post()
  async create(@Body() createMetaDto: CreateMetaDto) {
    const res = await this.metasService.create(createMetaDto);
    return { statusCode: HttpStatus.OK, message: 'OK', data: res };
  }

  @ApiOperation({ description: '查看分类列表' })
  @Get()
  async findAll() {
    const res = await this.metasService.findAll();
    return { statusCode: HttpStatus.OK, message: 'OK', data: res };
  }

  @ApiOperation({ description: '查看分类详情' })
  @Get(':mid')
  async findOne(@Param('mid') mid: string) {
    const res = await this.metasService.findById(+mid);
    return { statusCode: HttpStatus.OK, message: 'OK', data: res };
  }

  @ApiOperation({ description: '更新分类' })
  @Patch(':mid')
  async update(
    @Param('mid') mid: string,
    @Body() updateMetaDto: UpdateMetaDto,
  ) {
    const res = await this.metasService.update(+mid, updateMetaDto);
    return { statusCode: HttpStatus.OK, message: 'OK', data: res };
  }

  @ApiOperation({ description: '删除分类' })
  @Delete(':mid')
  async remove(@Param('mid') mid: string) {
    const res = await this.metasService.remove(+mid);
    return { statusCode: HttpStatus.OK, message: 'OK', data: res };
  }
}
