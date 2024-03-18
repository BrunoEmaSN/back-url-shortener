import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';
import { TinyUrlsService } from './tiny-url/tiny-url.service';
import { tinyUrlProviders } from './tiny-url/providers/tiny-url.providers';
import { DatabaseModule } from './database/db.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
          }
        })
      })
    }),
    UsersModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [TinyUrlsService, ...tinyUrlProviders],
})
export class AppModule {}
