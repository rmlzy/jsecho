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
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { LoggedGuard, Roles } from "@/guards";
import { OptionsService } from "../options/options.service";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags("用户")
@Controller("users")
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly optionsService: OptionsService,
  ) {}

  @ApiOperation({ description: "创建用户" })
  @UseGuards(LoggedGuard)
  @Roles(["administrator"])
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const res = await this.userService.create(createUserDto);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "用户列表" })
  @UseGuards(LoggedGuard)
  @Roles(["administrator"])
  @Get()
  async paginate(@Query() query) {
    const res = await this.userService.paginate(query);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "查询用户" })
  @UseGuards(LoggedGuard)
  @Roles(["administrator"])
  @Get(":uid")
  async findOne(@Param("uid") uid: string) {
    const res = await this.userService.findByUid(+uid);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "查询用户配置" })
  @Get(":uid/options")
  async findOptions(@Param("uid") uid: string) {
    const res = await this.optionsService.findByUid(+uid);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "更新用户信息" })
  @Patch(":uid")
  @Roles(["administrator"])
  async update(@Param("uid") uid: string, @Body() updateUserDto: UpdateUserDto) {
    const res = await this.userService.update(+uid, updateUserDto);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "删除用户" })
  @Delete(":uid")
  @Roles(["administrator"])
  @UseGuards(LoggedGuard)
  async remove(@Param("uid") uid: string) {
    const res = await this.userService.remove(+uid);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }
}
