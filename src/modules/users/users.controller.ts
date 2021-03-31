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
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from '../auth/jwt-guard';
import { OptionsService } from '../options/options.service';

@ApiTags('用户')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly optionsService: OptionsService,
  ) {}

  @ApiOperation({ description: '创建用户' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const res = await this.usersService.create(createUserDto);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @ApiOperation({ description: '用户列表' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const res = await this.usersService.findAll();
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @ApiOperation({ description: '创建用户' })
  @UseGuards(JwtAuthGuard)
  @Get(':uid')
  async findOne(@Param('uid') uid: string) {
    const res = await this.usersService.findOne(+uid);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @Get(':uid/options')
  async findOptions(@Param('uid') uid: string) {
    const res = await this.optionsService.findByUid(+uid);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @Patch(':uid/profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param('uid') uid: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const res = await this.usersService.updateProfile(+uid, updateProfileDto);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @Patch(':uid/password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Param('uid') uid: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const res = await this.usersService.updatePassword(+uid, updatePasswordDto);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @Delete(':uid')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('uid') uid: string) {
    const res = await this.usersService.remove(+uid);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }
}
