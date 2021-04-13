import { APP_INTERCEPTOR, APP_GUARD } from "@nestjs/core";
import { CacheInterceptor, CacheModule, HttpModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "nestjs-redis";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { config } from "./config";
import { AppController } from "./app.controller";
import { RoleGuard } from "./guards";
import { TaskService } from "./schedules/task/task.service";

// Modules
import { AuthModule } from "./modules/auth/auth.module";
import { ContentModule } from "./modules/content/content.module";
import { MetaModule } from "./modules/meta/meta.module";
import { OptionModule } from "./modules/option/option.module";
import { RelationshipModule } from "./modules/relationship/relationship.module";
import { UserModule } from "./modules/user/user.module";
import { WebModule } from "./modules/web/web.module";

// Entities
import { ContentEntity } from "./modules/content/content.entity";
import { MetaEntity } from "./modules/meta/meta.entity";
import { OptionEntity } from "./modules/option/option.entity";
import { RelationshipEntity } from "./modules/relationship/relationship.entity";
import { UserEntity } from "./modules/user/user.entity";

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
        type: "mysql",
        host: config.get("MYSQL.HOST"),
        port: config.get("MYSQL.PORT"),
        username: config.get("MYSQL.USERNAME"),
        password: config.get("MYSQL.PASSWORD") as string,
        database: config.get("MYSQL.DATABASE") as string,
        entities: [UserEntity, ContentEntity, MetaEntity, OptionEntity, RelationshipEntity],
        synchronize: true,
      }),
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        url: config.get("REDIS_URI"),
      }),
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: +config.get("CACHE.TTL"),
        max: +config.get("CACHE.MAX"),
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: +config.get("THROTTLER.TTL"),
        limit: +config.get("THROTTLER.LIMIT"),
      }),
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    UserModule,
    AuthModule,
    OptionModule,
    MetaModule,
    ContentModule,
    RelationshipModule,
    WebModule,
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
