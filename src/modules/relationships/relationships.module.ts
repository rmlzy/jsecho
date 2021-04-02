import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationshipsService } from './relationships.service';
import { RelationshipEntity } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([RelationshipEntity])],
  exports: [RelationshipsService],
  providers: [RelationshipsService],
})
export class RelationshipsModule {}
