import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Headers,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { Roles } from '../../guards';

@ApiTags('授权')
@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @ApiOperation({ description: '登录' })
  @Roles(['public'])
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const res = await this.authService.login(loginDto);
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
}
