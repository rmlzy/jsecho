import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { OptionsModule } from "../options/options.module";
import { ContentsModule } from "../contents/contents.module";
import { PublicApiController } from "./public-api/public-api.controller";
import { PublicViewController } from "./public-view/public-view.controller";
import { PublicViewService } from "./public-view/public-view.service";

@Module({
  imports: [AuthModule, UsersModule, OptionsModule, ContentsModule],
  controllers: [PublicApiController, PublicViewController],
  providers: [PublicViewService],
})
export class PublicModule {}
