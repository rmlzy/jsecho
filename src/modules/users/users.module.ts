import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from '../../entities';
import { OptionsModule } from '../options/options.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), OptionsModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
