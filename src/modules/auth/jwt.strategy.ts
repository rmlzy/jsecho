import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader("token"),
      secretOrKey: configService.get("JWT_SECRET_KEY"),
    });
  }

  async validate(values, done) {
    const { iat, exp, uid } = values;
    const timeDiff = exp - iat;
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findByUid(uid);
    delete user.password;
    done(null, user);
  }
}
