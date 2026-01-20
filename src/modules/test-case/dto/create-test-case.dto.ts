import { IsString, IsNotEmpty, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTestCaseDto {
  @ApiProperty({
    description: 'ID of the problem this test case belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  problemId: string;

  @ApiProperty({
    description: 'Input data for the test case',
    example: '5\n1 2 3 4 5',
  })
  @IsString()
  @IsNotEmpty()
  input: string;

  @ApiProperty({
    description: 'Expected output for the given input',
    example: '15',
  })
  @IsString()
  @IsNotEmpty()
  expectedOutput: string;

  @ApiProperty({
    description: 'Whether this test case is hidden from users',
    example: true,
    default: false,
  })
  @IsBoolean()
  isHidden: boolean;

  @ApiPropertyOptional({
    description: 'Explanation of the test case (optional)',
    example: 'Test case for sum of first 5 natural numbers',
  })
  @IsString()
  @IsNotEmpty()
  explanation?: string;

  @ApiPropertyOptional({
    description: 'Weight/score of this test case',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  score?: number;

  @ApiPropertyOptional({
    description:
      'Time limit override for this specific test case (milliseconds)',
    example: 2000,
    minimum: 100,
  })
  timeLimit?: number;

  @ApiPropertyOptional({
    description: 'Memory limit override for this specific test case (MB)',
    example: 512,
    minimum: 64,
  })
  memoryLimit?: number;

  @ApiPropertyOptional({
    description: 'Tags for categorizing test cases',
    example: ['edge-case', 'large-input', 'corner-case'],
    type: 'array',
    items: {
      type: 'string',
    },
  })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Order/position of the test case (for display purposes)',
    example: 1,
    minimum: 1,
  })
  order?: number;
}
