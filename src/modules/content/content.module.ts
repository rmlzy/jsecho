import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MetaModule } from "../meta/meta.module";
import { RelationshipModule } from "../relationship/relationship.module";
import { UserModule } from "../user/user.module";
import { OptionModule } from "../option/option.module";
import { ContentEntity } from "./content.entity";
import { ContentService } from "./content.service";
import { ContentController } from "./content.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentEntity]),
    MetaModule,
    RelationshipModule,
    UserModule,
    OptionModule,
  ],
  exports: [ContentService],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
