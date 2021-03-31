import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { Option } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Option])],
  exports: [OptionsService],
  controllers: [OptionsController],
  providers: [OptionsService],
})
export class OptionsModule {}
