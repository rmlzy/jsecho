import { Body, Controller, HttpStatus, Post, Headers, Get, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { LoggedGuard, Roles } from '../../guards';
import { UpdateProfileDto, UpdatePasswordDto } from '../../common';

@ApiTags('授权')
@Controller('')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) {}

  @ApiOperation({ description: '登录' })
  @Roles(['public'])
  @Post('/login')
  async login(@Body() dto: LoginDto) {
    const res = await this.authService.login(dto);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @ApiOperation({ description: '退出' })
  @Roles(['public'])
  @Get('/logout')
  async logout(@Headers('token') token) {
    const res = await this.authService.logout(token);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @ApiOperation({ description: '通过token查询用户' })
  @Roles(['public'])
  @Get('profile')
  async findByToken(@Headers('token') token: string) {
    const res = await this.userService.findByToken(token);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @ApiOperation({ description: '更新用户基本信息' })
  @UseGuards(LoggedGuard)
  @Roles(['public'])
  @Patch('updateProfile')
  async updateProfile(@Headers('token') token, @Body() dto: UpdateProfileDto) {
    const { uid } = this.authService.decodeToken(token);
    const res = await this.userService.updateProfile(uid, dto);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @ApiOperation({ description: '更新用户密码' })
  @UseGuards(LoggedGuard)
  @Roles(['public'])
  @Patch('updatePassword')
  async updatePassword(@Headers('token') token, @Body() dto: UpdatePasswordDto) {
    const { uid } = this.authService.decodeToken(token);
    const res = await this.userService.updatePassword(uid, dto);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }
}
