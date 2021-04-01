import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { verifyUserPassword, sleep, getTimestamp } from '../../utils';

type IGroup =
  | 'administrator'
  | 'editor'
  | 'contributor'
  | 'subscriber'
  | 'visitor';

interface IJwtPayload {
  uid: number;
  name: string;
  group: IGroup;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  decodeToken(token): IJwtPayload {
    return this.jwtService.decode(token, {
      json: true,
    }) as IJwtPayload;
  }

  async login(loginDto: LoginDto) {
    const { name, password } = loginDto;
    const user = await this.userService.findByNameOrMail(name);
    if (!user) {
      throw new HttpException('用户不存在', 404);
    }
    const allowGroups = [
      'administrator',
      'editor',
      'contributor',
      'subscriber',
    ];
    if (!allowGroups.includes(user.group)) {
      throw new ForbiddenException('你无权登录');
    }
    const valid = verifyUserPassword(password, user.password);
    if (!valid) {
      await sleep(3000);
      throw new HttpException('用户名或密码无效', 409);
    }
    const payload: IJwtPayload = {
      name,
      uid: user.uid,
      group: user.group as IGroup,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: '1d',
    });
    await this.userService.update(user.uid, {
      logged: getTimestamp(),
      authCode: token,
    });
    return token;
  }

  async logout(token) {
    if (!token) {
      throw new HttpException('未检测到Token', 409);
    }
    const user = await this.userService.findByToken(token);
    if (!user) {
      throw new HttpException('用户不存在', 404);
    }
    await this.userService.removeToken(user.uid);
    return null;
  }
}
