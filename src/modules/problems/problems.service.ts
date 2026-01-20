import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) {}

  async create(createProblemDto: CreateProblemDto) {
    try {
      const { title } = createProblemDto;

      // Vérifier si un problème avec le même titre existe
      const existing = await this.problemRepository.findOneBy({ title });
      if (existing) {
        throw new BadRequestException('Problem with this title already exists');
      }

      const problem = this.problemRepository.create(createProblemDto);
      const savedProblem = await this.problemRepository.save(problem);

      return savedProblem;
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  async findAll() {
    try {
      const [problems, count] = await this.problemRepository.findAndCount({
        order: { createdAt: 'DESC' },
      });

      return {
        problems,
        count,
      };
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  async findOne(id: string) {
    try {
      const problem = await this.problemRepository.findOneBy({ id });

      if (!problem) {
        return null;
      }

      return problem;
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  async update(id: string, updateProblemDto: UpdateProblemDto) {
    try {
      const problem = await this.problemRepository.findOneBy({ id });

      if (!problem) {
        throw new NotFoundException('Problem not found');
      }

      Object.assign(problem, updateProblemDto);

      const updatedProblem = await this.problemRepository.save(problem);
      return updatedProblem;
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  async remove(id: string) {
    try {
      const problem = await this.problemRepository.findOneBy({ id });

      if (!problem) {
        throw new NotFoundException('Problem not found');
      }

      await this.problemRepository.remove(problem);

      return {
        success: true,
        message: 'Problem deleted successfully',
      };
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }
}
