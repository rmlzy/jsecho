import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { Content } from '../../entities';
import { MetasModule } from '../metas/metas.module';
import { RelationshipsModule } from '../relationships/relationships.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content]),
    MetasModule,
    RelationshipsModule,
  ],
  exports: [ContentsService],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {}
