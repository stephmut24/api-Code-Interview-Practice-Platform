import { IsString, IsNotEmpty, IsUUID, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({
    description: 'ID of the problem to submit',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  problemId: string;

  @ApiProperty({
    description: 'Programming language',
    enum: ['python', 'javascript'],
    example: 'python',
  })
  @IsString()
  @IsIn(['python', 'javascript'])
  language: string;

  @ApiProperty({
    description: 'Source code to evaluate',
    example: 'def solve():\n    return 42',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
