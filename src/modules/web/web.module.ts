import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { OptionModule } from "../option/option.module";
import { ContentModule } from "../content/content.module";
import { WebService } from "./web.service";
import { WebController } from "./web.controller";

@Module({
  imports: [AuthModule, UserModule, OptionModule, ContentModule],
  controllers: [WebController],
  providers: [WebService],
})
export class WebModule {}
