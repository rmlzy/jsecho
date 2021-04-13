import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OptionService } from "./option.service";
import { OptionController } from "./option.controller";
import { OptionEntity } from "./option.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OptionEntity])],
  exports: [OptionService],
  controllers: [OptionController],
  providers: [OptionService],
})
export class OptionModule {}
