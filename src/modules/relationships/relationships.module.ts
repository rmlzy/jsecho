import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetasModule } from '../metas/metas.module';
import { RelationshipEntity } from './entity/relationship.entity';
import { RelationshipsService } from './relationships.service';

@Module({
  imports: [TypeOrmModule.forFeature([RelationshipEntity]), MetasModule],
  exports: [RelationshipsService],
  providers: [RelationshipsService],
})
export class RelationshipsModule {}
