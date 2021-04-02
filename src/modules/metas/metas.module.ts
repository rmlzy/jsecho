import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetasService } from './metas.service';
import { MetasController } from './metas.controller';
import { MetaEntity } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([MetaEntity])],
  exports: [MetasService],
  controllers: [MetasController],
  providers: [MetasService],
})
export class MetasModule {}
