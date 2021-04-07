import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { OptionEntity } from './entity/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OptionEntity])],
  exports: [OptionsService],
  controllers: [OptionsController],
  providers: [OptionsService],
})
export class OptionsModule {}
