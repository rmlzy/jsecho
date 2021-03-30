import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import {
  CacheInterceptor,
  CacheModule,
  HttpModule,
  Module,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvFilePath } from './utils';
import { AppController } from './app.controller';

// Modules
import { TaskService } from './schedules/task/task.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { OptionsModule } from './modules/options/options.module';
import { MetasModule } from './modules/metas/metas.module';
import { ContentsModule } from './modules/contents/contents.module';

// Entities
import { User } from './modules/users/entities/user.entity';
import { Option } from './modules/options/entities/option.entity';
import { Meta } from './modules/metas/entities/meta.entity';
import { Content } from './modules/contents/entities/content.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: getEnvFilePath(),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('MYSQL_HOST'),
        port: config.get('MYSQL_PORT'),
        username: config.get('MYSQL_USERNAME'),
        password: config.get('MYSQL_PASSWORD'),
        database: config.get('MYSQL_DATABASE'),
        entities: [User, Option, Meta, Content],
        synchronize: true,
      }),
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        url: config.get('REDIS_URI'),
      }),
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: +config.get('CACHE_TTL'),
        max: +config.get('CACHE_MAX'),
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: +config.get('THROTTLER_TTL'),
        limit: +config.get('THROTTLER_LIMIT'),
      }),
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    UsersModule,
    AuthModule,
    OptionsModule,
    MetasModule,
    ContentsModule,
  ],
  controllers: [AppController],
  providers: [
    TaskService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
