import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OptionModule } from "../option/option.module";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), OptionModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
