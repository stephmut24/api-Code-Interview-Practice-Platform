import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './config/db.module';

@Module({
  imports: [DatabaseModule, UsersModule],
})
export class AppModule {}
