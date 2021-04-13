import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoggedGuard, Roles } from "@/guards";
import { MetaService } from "./meta.service";
import { CreateMetaDto } from "./dto/create-meta.dto";
import { UpdateMetaDto } from "./dto/update-meta.dto";

@ApiTags("分类")
@Controller("metas")
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @ApiOperation({ description: "创建分类" })
  @UseGuards(LoggedGuard)
  @Roles(["administrator"])
  @Post()
  async create(@Body() createMetaDto: CreateMetaDto) {
    const res = await this.metaService.create(createMetaDto);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "查看分类列表" })
  @UseGuards(LoggedGuard)
  @Roles(["administrator"])
  @Get()
  async paginate(@Query() query) {
    const res = await this.metaService.paginate(query);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "查看分类详情" })
  @UseGuards(LoggedGuard)
  @Roles(["administrator"])
  @Get(":mid")
  async findOne(@Param("mid") mid: string) {
    const res = await this.metaService.findById(+mid);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "更新分类" })
  @UseGuards(LoggedGuard)
  @Roles(["administrator"])
  @Patch(":mid")
  async update(@Param("mid") mid: string, @Body() updateMetaDto: UpdateMetaDto) {
    const res = await this.metaService.update(+mid, updateMetaDto);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "删除分类" })
  @UseGuards(LoggedGuard)
  @Roles(["administrator"])
  @Delete(":mid")
  async remove(@Param("mid") mid: string) {
    const res = await this.metaService.remove(+mid);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }
}
