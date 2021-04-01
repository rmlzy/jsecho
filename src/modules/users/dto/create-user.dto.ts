import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  // TODO: XSS Check
  @IsNotEmpty({ message: '必须填写用户名称' })
  @MinLength(2, { message: '用户名至少包含2个字符' })
  @MaxLength(32, { message: '用户名最多包含32个字符' })
  name: string;

  @IsNotEmpty({ message: '必须填写密码' })
  @MinLength(6, { message: '为了保证账户安全, 请输入至少六位的密码' })
  @MaxLength(18, { message: '为了便于记忆, 密码长度请不要超过十八位' })
  password: string;

  @IsNotEmpty({ message: '必须填写电子邮箱' })
  @IsEmail({}, { message: '电子邮箱格式错误' })
  @MaxLength(64, { message: '电子邮箱最多包含64个字符' })
  mail: string;

  @IsNotEmpty()
  @IsEnum(['administrator', 'editor', 'contributor', 'subscriber', 'visitor'])
  type: string;
}
