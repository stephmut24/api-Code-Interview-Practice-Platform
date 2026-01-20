import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsString()
  @ApiProperty({
    name: 'email',
    example: 'example@example.com',
  })
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}
