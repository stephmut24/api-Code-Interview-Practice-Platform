import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionsService } from './submission.service';
import { SubmissionsController } from './submission.controller';
import { Submission } from './entities/submission.entity';
import { Problem } from '@/modules/problems/entities/problem.entity';
import { User } from '@/modules/users/entities/user.entity';
import { TestCase } from '@/modules/test-case/entities/test-case.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Submission, Problem, User, TestCase])],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
})
export class SubmissionsModule {}
