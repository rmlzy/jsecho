import { PartialType } from "@nestjs/swagger";
import { CreateWebDto } from "./create-web.dto";

export class UpdateWebDto extends PartialType(CreateWebDto) {}
