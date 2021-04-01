import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { verifyUserPassword, sleep, getTimestamp } from '../../utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { name, password } = loginDto;
    const user = await this.usersService.findByNameOrMail(name);
    if (!user) {
      throw new HttpException('用户不存在', 404);
    }
    const valid = verifyUserPassword(password, user.password);
    if (!valid) {
      await sleep(3000);
      throw new HttpException('用户名或密码无效', 409);
    }
    const payload = { uid: user.uid, name, group: user.group };
    const token = this.jwtService.sign(payload, {
      expiresIn: '1d',
    });
    await this.usersService.update(user.uid, {
      logged: getTimestamp(),
      authCode: token,
    });
    return token;
  }

  async logout(token) {
    if (!token) {
      throw new HttpException('未检测到Token', 409);
    }
    const user = await this.usersService.findByToken(token);
    if (!user) {
      throw new HttpException('用户不存在', 404);
    }
    await this.usersService.removeToken(user.uid);
    return null;
  }
}
