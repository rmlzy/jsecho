import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { OptionsModule } from "../options/options.module";
import { ContentsModule } from "../contents/contents.module";
import { WebService } from "./web.service";
import { WebController } from "./web.controller";

@Module({
  imports: [AuthModule, UsersModule, OptionsModule, ContentsModule],
  controllers: [WebController],
  providers: [WebService],
})
export class WebModule {}
