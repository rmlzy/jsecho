import { ApiProperty } from '@nestjs/swagger';

export abstract class ResponseVo<T> {
  @ApiProperty({ description: 'HTTP 状态码' })
  statusCode: number;

  @ApiProperty({ description: 'HTTP 描述' })
  message: string;

  abstract get data(): T;
}
