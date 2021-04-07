import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetasModule } from '../metas/metas.module';
import { RelationshipsModule } from '../relationships/relationships.module';
import { UsersModule } from '../users/users.module';
import { ContentEntity } from './entity/content.entity';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { OptionsModule } from '../options/options.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentEntity]),
    MetasModule,
    RelationshipsModule,
    UsersModule,
    OptionsModule,
  ],
  exports: [ContentsService],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {}
