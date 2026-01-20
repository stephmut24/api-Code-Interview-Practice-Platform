import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './config/db.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProblemsModule } from './modules/problems/problems.module';
import { TestCaseModule } from './modules/test-case/test-case.module';
import { SubmissionsModule } from './modules/submission/submission.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProblemsModule,
    TestCaseModule,
    SubmissionsModule,
  ],
})
export class AppModule {}
