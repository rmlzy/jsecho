import { IsEnum, IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class CreateMetaDto {
  @IsNotEmpty({ message: '必须填写分类名称' })
  @MaxLength(200, { message: '分类名称最多包含200个字符' })
  name: string;

  @IsOptional()
  @MaxLength(200, { message: '分类缩略名最多包含200个字符' })
  slug: string;

  @IsOptional()
  @MaxLength(200, { message: '分类描述最多包含200个字符' })
  description: string;

  @IsNotEmpty()
  @IsEnum(['tag', 'category'], { message: 'type字段取值错误' })
  type: string;

  @IsOptional()
  @IsNumber()
  count: number;

  @IsOptional()
  @IsNumber()
  order: number;

  @IsOptional()
  @IsNumber()
  parent: number;
}
