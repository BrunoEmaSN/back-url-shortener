import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/db.module';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { userProviders } from './providers/user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, ...userProviders],
})
export class UsersModule {}