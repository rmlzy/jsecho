import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationshipsService } from './relationships.service';
import { Relationship } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Relationship])],
  exports: [RelationshipsService],
  providers: [RelationshipsService],
})
export class RelationshipsModule {}
