import { Body, Controller, Get, Headers, HttpStatus, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { LoggedGuard } from "@/guards";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @ApiOperation({ description: "登录" })
  @Post("/login")
  async login(@Body() dto: LoginDto) {
    const res = await this.authService.login(dto);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "登出" })
  @Get("/logout")
  async logout(@Headers("token") token) {
    const res = await this.authService.logout(token);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "通过token查询用户" })
  @Get("profile")
  async findByToken(@Headers("token") token: string) {
    const res = await this.userService.findByToken(token);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "更新用户基本信息" })
  @UseGuards(LoggedGuard)
  @Patch("updateProfile")
  async updateProfile(@Headers("token") token, @Body() dto: UpdateProfileDto) {
    const { uid } = this.authService.decodeToken(token);
    const res = await this.userService.updateProfile(uid, dto);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @ApiOperation({ description: "更新用户密码" })
  @UseGuards(LoggedGuard)
  @Patch("updatePassword")
  async updatePassword(@Headers("token") token, @Body() dto: UpdatePasswordDto) {
    const { uid } = this.authService.decodeToken(token);
    const res = await this.userService.updatePassword(uid, dto);
    return { code: HttpStatus.OK, message: "OK", data: res };
  }
}
