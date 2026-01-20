import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './config/db.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule],
})
export class AppModule {}
