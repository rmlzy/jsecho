import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OptionService } from "./option.service";

@ApiTags("配置")
@Controller("options")
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Get()
  async findAll() {
    const res = await this.optionService.findAll();
    return { code: HttpStatus.OK, message: "OK", data: res };
  }

  @Get("default")
  async findDefault() {
    const res = await this.optionService.findDefault();
    return { code: HttpStatus.OK, message: "OK", data: res };
  }
}
