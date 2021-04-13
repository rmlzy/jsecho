import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @IsNotEmpty({ message: "必须填写密码" })
  @MinLength(6, { message: "为了保证账户安全, 请输入至少六位的密码" })
  @MaxLength(18, { message: "为了便于记忆, 密码长度请不要超过十八位" })
  password: string;
}
