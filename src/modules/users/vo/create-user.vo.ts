import { ApiProperty } from '@nestjs/swagger';
import { ResponseVo } from '../../../base';

class UserBaseVo {
  @ApiProperty({ description: 'ID' })
  uid: string;

  @ApiProperty({ description: '用户名' })
  name: string;

  @ApiProperty({ description: '昵称' })
  screenName: string;

  @ApiProperty({ description: '邮箱' })
  mail: string;
}

export class CreateUserVo extends ResponseVo<UserBaseVo> {
  @ApiProperty()
  data: UserBaseVo;
}

export class GetUserVo extends ResponseVo<UserBaseVo> {
  @ApiProperty()
  data: UserBaseVo;
}
