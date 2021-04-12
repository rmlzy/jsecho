import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { CacheInterceptor, CacheModule, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config';
import { AppController } from './app.controller';
import { RoleGuard } from './guards';
import { TaskService } from './schedules/task/task.service';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { ContentsModule } from './modules/contents/contents.module';
import { MetasModule } from './modules/metas/metas.module';
import { OptionsModule } from './modules/options/options.module';
import { PublicModule } from './modules/public/public.module';
import { RelationshipsModule } from './modules/relationships/relationships.module';
import { UsersModule } from './modules/users/users.module';

// Entities
import { ContentEntity } from './modules/contents/entity/content.entity';
import { MetaEntity } from './modules/metas/entity/meta.entity';
import { OptionEntity } from './modules/options/entity/option.entity';
import { RelationshipEntity } from './modules/relationships/entity/relationship.entity';
import { UserEntity } from './modules/users/entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('MYSQL.HOST'),
        port: config.get('MYSQL.PORT'),
        username: config.get('MYSQL.USERNAME'),
        password: config.get('MYSQL.PASSWORD') as string,
        database: config.get('MYSQL.DATABASE') as string,
        entities: [UserEntity, ContentEntity, MetaEntity, OptionEntity, RelationshipEntity],
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
        ttl: +config.get('CACHE.TTL'),
        max: +config.get('CACHE.MAX'),
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: +config.get('THROTTLER.TTL'),
        limit: +config.get('THROTTLER.LIMIT'),
      }),
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    UsersModule,
    AuthModule,
    OptionsModule,
    MetasModule,
    ContentsModule,
    RelationshipsModule,
    PublicModule,
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
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
