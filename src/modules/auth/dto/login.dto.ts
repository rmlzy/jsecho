import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '用户名' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '密码' })
  password: string;
}
