import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsNumber,
  Min,
  IsOptional,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class SampleTestCaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  input: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  output: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  explanation?: string;
}

export class CreateProblemDto {
  @ApiProperty({
    description: 'Title of the coding problem',
    example: 'Two Sum',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the problem',
    example:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Difficulty level',
    enum: ['easy', 'medium', 'hard'],
    example: 'medium',
  })
  @IsString()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty: string;

  @ApiProperty({
    description: 'Problem constraints',
    example: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9',
  })
  @IsString()
  @IsNotEmpty()
  constraints: string;

  @ApiProperty({
    description: 'Time limit in milliseconds (min: 100)',
    example: 1000,
  })
  @IsNumber()
  @Min(100)
  @Type(() => Number)
  timeLimit: number;

  @ApiProperty({
    description: 'Memory limit in megabytes (min: 64)',
    example: 256,
  })
  @IsNumber()
  @Min(64)
  @Type(() => Number)
  memoryLimit: number;

  @ApiPropertyOptional({
    description: 'Sample test cases',
    type: [SampleTestCaseDto],
  })
  @IsOptional()
  @IsArray()
  @Type(() => SampleTestCaseDto)
  sampleTestCases?: SampleTestCaseDto[];

  @ApiPropertyOptional({
    description: 'Problem tags',
    example: ['array', 'hash-table'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Boilerplate code by language',
    example: {
      javascript: 'function solve() {}',
      python: 'def solve(): pass',
    },
  })
  @IsOptional()
  @IsObject()
  boilerplateCode?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Hint for solving',
    example: 'Use a hash map for O(n) solution',
  })
  @IsOptional()
  @IsString()
  hint?: string;
}
