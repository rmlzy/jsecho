import { Body, Controller, HttpStatus, Post, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('授权')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ description: '登录' })
  async login(@Body() loginDto: LoginDto) {
    const doc = await this.authService.login(loginDto);
    return { statusCode: HttpStatus.OK, message: 'OK', data: doc };
  }

  @Post('/logout')
  @ApiOperation({ description: '退出' })
  @ApiHeader({
    name: 'X-Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  async logout(@Headers() headers) {
    const token = headers['x-authorization'];
    const doc = await this.authService.logout(token);
    return { statusCode: HttpStatus.OK, message: 'OK', data: doc };
  }
}
