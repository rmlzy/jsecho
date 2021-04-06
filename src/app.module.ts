import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { CacheInterceptor, CacheModule, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import environment from './environments';
import { AppController } from './app.controller';
import { RoleGuard } from './guards';
import { TaskService } from './schedules/task/task.service';

// Modules
import {
  UsersModule,
  AuthModule,
  OptionsModule,
  MetasModule,
  ContentsModule,
  RelationshipsModule,
  PublicModule,
} from './modules';

// Entities
import {
  UserEntity,
  ContentEntity,
  MetaEntity,
  OptionEntity,
  RelationshipEntity,
} from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [environment],
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
