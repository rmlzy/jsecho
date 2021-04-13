import { IsEnum, IsNotEmpty, IsOptional, IsArray, MaxLength } from "class-validator";

export class CreateContentDto {
  @IsNotEmpty({ message: "必须填写文章标题" })
  @MaxLength(200, { message: "文章标题最多包含200个字符" })
  title: string;

  @IsOptional()
  @MaxLength(200, { message: "文章缩略名最多包含200个字符" })
  slug: string;

  @IsNotEmpty({ message: "必须填写文章正文" })
  text: string;

  @IsNotEmpty()
  @IsEnum(["page", "post"], { message: "type字段取值错误" })
  type: string;

  @IsOptional()
  template: string;

  @IsOptional()
  date: string;

  @IsNotEmpty()
  @IsEnum(["save", "publish"], { message: "action字段取值错误" })
  action: string;

  @IsOptional()
  @IsArray()
  categories: number[];

  @IsOptional()
  @IsArray()
  tags: string[];

  @IsNotEmpty()
  @IsEnum(["hidden", "waiting", "private", "password"], {
    message: "visibility字段取值错误",
  }) // 隐藏, 待审核, 私密, 密码保护
  visibility: string;

  @IsOptional()
  password: string;

  @IsNotEmpty()
  @IsEnum(["0", "1"], { message: "allowComment字段取值错误" })
  allowComment: string;

  @IsNotEmpty()
  @IsEnum(["0", "1"], { message: "allowPing字段取值错误" })
  allowPing: string;

  @IsNotEmpty()
  @IsEnum(["0", "1"], { message: "allowFeed字段取值错误" })
  allowFeed: string;
}
