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
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoggedGuard, Roles } from "@/guards";
import { ContentService } from "./content.service";
import { CreateContentDto } from "./dto/create-content.dto";
import { UpdateContentDto } from "./dto/update-content.dto";

@ApiTags("文章")
@Controller("contents")
export class ContentController {
  constructor(private readonly contentsService: ContentService) {}

  @ApiOperation({ description: "创建文章" })
  @UseGuards(LoggedGuard)
  @Roles(["administrator", "editor", "contributor"])
  @Post()
  async create(@Body() createContentDto: CreateContentDto) {
    const res = await this.contentsService.create(createContentDto);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "获取文章分页列表" })
  @UseGuards(LoggedGuard)
  @Roles(["administrator", "editor", "contributor"])
  @Get()
  async paginate(@Query() query) {
    const res = await this.contentsService.paginate(query);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "获取文章" })
  @UseGuards(LoggedGuard)
  @Roles(["administrator", "editor", "contributor"])
  @Get(":cid")
  async findOne(@Param("cid") cid: string) {
    const res = await this.contentsService.findById(+cid);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "更新文章" })
  @UseGuards(LoggedGuard)
  @Roles(["administrator", "editor", "contributor"])
  @Patch(":cid")
  async update(@Param("cid") cid: string, @Body() updateContentDto: UpdateContentDto) {
    const res = await this.contentsService.update(+cid, updateContentDto);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "删除文章" })
  @UseGuards(LoggedGuard)
  @Roles(["administrator", "editor", "contributor"])
  @Delete(":cid")
  async remove(@Param("cid") cid: string) {
    const res = await this.contentsService.remove(+cid);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }
}
