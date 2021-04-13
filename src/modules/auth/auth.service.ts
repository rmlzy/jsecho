import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BaseService } from "@/base";
import { verifyUserPassword, sleep } from "@/utils";
import { ALLOW_LOGIN_GROUPS } from "@/constants";
import { UsersService } from "../users/users.service";
import { IUserGroup } from "../users/interface/user.interface";
import { LoginDto } from "./dto/login.dto";
import { IJwtPayload } from "./interface/auth.interface";

@Injectable()
export class AuthService extends BaseService<any> {
  constructor(private userService: UsersService, private jwtService: JwtService) {
    super(null);
  }

  decodeToken(token): IJwtPayload {
    return this.jwtService.decode(token, {
      json: true,
    }) as IJwtPayload;
  }

  async login(loginDto: LoginDto) {
    const { name, password } = loginDto;
    const user = await this.userService.findLoginInfoByAccount(name);
    this.asset(ALLOW_LOGIN_GROUPS.includes(user.group), "你无权登录");

    const valid = verifyUserPassword(password, user.password);
    this.asset(valid, "用户名或密码无效");
    if (!valid) {
      await sleep(3000);
    }

    const payload: IJwtPayload = {
      name,
      uid: user.uid,
      group: user.group as IUserGroup,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: "1d",
    });
    await this.userService.setToken(user.uid, token);
    return token;
  }

  async logout(token) {
    const user = await this.userService.findByToken(token);
    await this.userService.removeToken(user.uid);
    return null;
  }
}
