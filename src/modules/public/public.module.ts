import { Module } from '@nestjs/common';
import { PublicApiController } from './public-api/public-api.controller';
import { PublicViewController } from './public-view/public-view.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { OptionsModule } from '../options/options.module';
import { PublicViewService } from './public-view/public-view.service';
import { ContentsModule } from '../contents/contents.module';

@Module({
  imports: [AuthModule, UsersModule, OptionsModule, ContentsModule],
  controllers: [PublicApiController, PublicViewController],
  providers: [PublicViewService],
})
export class PublicModule {}
