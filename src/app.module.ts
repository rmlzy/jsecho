import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import {
  CacheInterceptor,
  CacheModule,
  HttpModule,
  Module,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import environment from './environments';
import { AppController } from './app.controller';
import { RoleGuard } from './guards';

// Modules
import { TaskService } from './schedules/task/task.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { OptionsModule } from './modules/options/options.module';
import { MetasModule } from './modules/metas/metas.module';
import { ContentsModule } from './modules/contents/contents.module';
import { RelationshipsModule } from './modules/relationships/relationships.module';

// Entities
import { User, Content, Meta, Option, Relationship } from './entities';

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
        password: config.get('MYSQL.PASSWORD'),
        database: config.get('MYSQL.DATABASE'),
        entities: [User, Content, Meta, Option, Relationship],
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
