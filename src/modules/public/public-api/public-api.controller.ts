import { Body, Controller, Get, Headers, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../users/users.service';
import { LoggedGuard, Roles } from '../../../guards';
import { LoginDto } from '../../auth/dto/login.dto';
import { UpdatePasswordDto, UpdateProfileDto } from '../../../common';

@ApiTags('公开API')
@Controller('')
export class PublicApiController {
  constructor(private authService: AuthService, private userService: UsersService) {}

  @ApiOperation({ description: '登录' })
  @Post('/login')
  async login(@Body() dto: LoginDto) {
    const res = await this.authService.login(dto);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @ApiOperation({ description: '登出' })
  @Get('/logout')
  async logout(@Headers('token') token) {
    const res = await this.authService.logout(token);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @ApiOperation({ description: '通过token查询用户' })
  @Get('profile')
  async findByToken(@Headers('token') token: string) {
    const res = await this.userService.findByToken(token);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @ApiOperation({ description: '更新用户基本信息' })
  @UseGuards(LoggedGuard)
  @Patch('updateProfile')
  async updateProfile(@Headers('token') token, @Body() dto: UpdateProfileDto) {
    const { uid } = this.authService.decodeToken(token);
    const res = await this.userService.updateProfile(uid, dto);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @ApiOperation({ description: '更新用户密码' })
  @UseGuards(LoggedGuard)
  @Patch('updatePassword')
  async updatePassword(@Headers('token') token, @Body() dto: UpdatePasswordDto) {
    const { uid } = this.authService.decodeToken(token);
    const res = await this.userService.updatePassword(uid, dto);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }
}
