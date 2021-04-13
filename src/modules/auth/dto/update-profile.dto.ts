import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "昵称至少包含2个字符" })
  @MaxLength(32, { message: "昵称最多包含32个字符" })
  screenName: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: "个人主页地址最多包含32个字符" })
  url: string;

  @IsOptional()
  @IsString()
  @IsEmail({}, { message: "电子邮箱格式错误" })
  @MaxLength(64, { message: "电子邮箱最多包含64个字符" })
  mail: string;
}
