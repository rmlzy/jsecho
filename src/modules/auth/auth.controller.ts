import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Headers,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@ApiTags('授权')
@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/login')
  @ApiOperation({ description: '登录' })
  async login(@Body() loginDto: LoginDto) {
    const res = await this.authService.login(loginDto);
    return { code: HttpStatus.OK, message: 'OK', data: res };
  }

  @Get('/logout')
  @ApiOperation({ description: '退出' })
  @ApiHeader({
    name: 'X-Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
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
}
