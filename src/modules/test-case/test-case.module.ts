import { Module } from '@nestjs/common';
import { TestCasesController } from './test-case.controller';
import { ProblemsModule } from '../problems/problems.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCase } from './entities/test-case.entity';
import { Problem } from '../problems/entities/problem.entity';
import { TestCasesService } from './test-case.service';

@Module({
  imports: [ProblemsModule, TypeOrmModule.forFeature([TestCase, Problem])],
  controllers: [TestCasesController],
  providers: [TestCasesService],
  exports: [TestCasesService],
})
export class TestCaseModule {}
