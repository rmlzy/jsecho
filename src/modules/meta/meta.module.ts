import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MetaService } from "./meta.service";
import { MetaController } from "./meta.controller";
import { MetaEntity } from "./meta.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MetaEntity])],
  exports: [MetaService],
  controllers: [MetaController],
  providers: [MetaService],
})
export class MetaModule {}
