import {
  Injectable,
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestCase } from './entities/test-case.entity';
import { Problem } from '@/modules/problems/entities/problem.entity';
import { CreateTestCaseDto } from './dto/create-test-case.dto';
import { UpdateTestCaseDto } from './dto/update-test-case.dto';

@Injectable()
export class TestCasesService {
  constructor(
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,

    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) {}

  async create(createTestCaseDto: CreateTestCaseDto) {
    try {
      const { problemId, input, expectedOutput, isHidden } = createTestCaseDto;

      // eslint-disable-next-line prettier/prettier
      const problem = await this.problemRepository.findOne({ where: { id: problemId } });
      if (!problem) {
        throw new BadRequestException('Problem not found');
      }

      const testCase = this.testCaseRepository.create({
        problem,
        input,
        expectedOutput,
        isHidden,
      });

      const savedTestCase = await this.testCaseRepository.save(testCase);
      return savedTestCase;
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  async findAllByProblem(problemId: string) {
    try {
      const problem = await this.problemRepository.findOne({
        where: { id: problemId },
      });
      if (!problem) {
        throw new BadRequestException('Problem not found');
      }

      const testCases = await this.testCaseRepository.find({
        where: { problem: { id: problemId } },
        order: { createdAt: 'DESC' },
      });

      return testCases;
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  async findOne(id: string) {
    try {
      const testCase = await this.testCaseRepository.findOne({ where: { id } });
      if (!testCase) {
        throw new NotFoundException('TestCase not found');
      }
      return testCase;
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  async update(id: string, updateTestCaseDto: UpdateTestCaseDto) {
    try {
      const testCase = await this.testCaseRepository.findOne({ where: { id } });
      if (!testCase) {
        throw new NotFoundException('TestCase not found');
      }

      // Si problemId est mis à jour, vérifier qu’il existe
      if (updateTestCaseDto.problemId) {
        const problem = await this.problemRepository.findOne({
          where: { id: updateTestCaseDto.problemId },
        });
        if (!problem) {
          throw new BadRequestException('Problem not found');
        }
        testCase.problem = problem;
      }

      Object.assign(testCase, updateTestCaseDto);
      const updated = await this.testCaseRepository.save(testCase);
      return updated;
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  async remove(id: string) {
    try {
      const testCase = await this.testCaseRepository.findOne({ where: { id } });
      if (!testCase) {
        throw new NotFoundException('TestCase not found');
      }

      await this.testCaseRepository.remove(testCase);
      return {
        success: true,
        message: 'TestCase deleted successfully',
      };
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }
}
