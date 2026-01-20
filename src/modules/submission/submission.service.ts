/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission, SubmissionStatus } from './entities/submission.entity';
import { Problem } from '@/modules/problems/entities/problem.entity';
import { User } from '@/modules/users/entities/user.entity';
import { TestCase } from '@/modules/test-case/entities/test-case.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { exec } from 'child_process';
import { promisify } from 'util';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const execAsync = promisify(exec);

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,

    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,
  ) {}

  async submit(createSubmissionDto: CreateSubmissionDto, userId: string) {
    try {
      const { problemId, language, code } = createSubmissionDto;

      const problem = await this.problemRepository.findOne({
        where: { id: problemId },
      });
      if (!problem) throw new BadRequestException('Problem not found');

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');

      const submission = this.submissionRepository.create({
        problem,
        user,
        language,
        code,
        status: SubmissionStatus.PENDING,
      });

      const savedSubmission = await this.submissionRepository.save(submission);

      // 🔥 Lancer le judge de manière asynchrone
      this.judgeDocker(savedSubmission).catch((err) => console.error(err));

      return {
        submissionId: savedSubmission.id,
        status: SubmissionStatus.PENDING,
      };
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  async findById(submissionId: string) {
    try {
      const submission = await this.submissionRepository.findOne({
        where: { id: submissionId },
        relations: ['problem', 'user'],
      });

      if (!submission) {
        throw new BadRequestException('Submission not found');
      }

      return {
        submissionId: submission.id,
        status: submission.status,
        problem: {
          id: submission.problem.id,
          title: submission.problem.title,
        },
        user: {
          id: submission.user.id,
          email: submission.user.email,
        },
      };
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  // ===============================
  // JUDGE ASYNCHRONE AVEC DOCKER
  // ===============================
  private async judgeDocker(submission: Submission) {
    const testCases = await this.testCaseRepository.find({
      where: { problem: { id: submission.problem.id } },
    });

    for (const test of testCases) {
      try {
        const output = await this.runInDocker(
          submission.code,
          test.input,
          submission.problem.timeLimit,
        );

        if (output.trim() !== test.expectedOutput.trim()) {
          submission.status = SubmissionStatus.WRONG_ANSWER;
          await this.submissionRepository.save(submission);
          return;
        }
      } catch (err) {
        if (err === 'TIME_LIMIT_EXCEEDED') {
          submission.status = SubmissionStatus.TIME_LIMIT_EXCEEDED;
        } else {
          submission.status = SubmissionStatus.RUNTIME_ERROR;
        }
        await this.submissionRepository.save(submission);
        return;
      }
    }

    submission.status = SubmissionStatus.ACCEPTED;
    await this.submissionRepository.save(submission);
  }

  // =====================================
  // EXÉCUTER LE CODE DANS UN CONTAINER DOCKER
  // =====================================
  private async runInDocker(
    code: string,
    input: string,
    timeLimitMs: number,
  ): Promise<string> {
    // Crée le contenu à injecter : code + input
    const fullCode = `
${code}

if __name__ == "__main__":
    solve()
`;

    // Commande Docker sécurisée
    const cmd = `
docker run --rm \
--network none \
--memory=256m \
--cpus=0.5 \
--pids-limit=64 \
judge-python
`;

    return new Promise((resolve, reject) => {
      const child = exec(
        cmd,
        { timeout: timeLimitMs },
        (error, stdout, stderr) => {
          if (error) {
            if (error.killed) {
              return reject('TIME_LIMIT_EXCEEDED');
            }
            return reject(stderr || error.message);
          }
          resolve(stdout);
        },
      );

      // Injecter code + input
      child.stdin?.write(fullCode + '\n###INPUT###\n' + input);
      child.stdin?.end();
    });
  }
}
