import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MetaModule } from "../meta/meta.module";
import { RelationshipEntity } from "./relationship.entity";
import { RelationshipService } from "./relationship.service";

@Module({
  imports: [TypeOrmModule.forFeature([RelationshipEntity]), MetaModule],
  exports: [RelationshipService],
  providers: [RelationshipService],
})
export class RelationshipModule {}
