import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';
import { TinyUrlsService } from './tiny-url/tiny-url.service';
import { tinyUrlProviders } from './tiny-url/providers/tiny-url.providers';
import { DatabaseModule } from './database/db.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [TinyUrlsService, ...tinyUrlProviders],
})
export class AppModule {}
