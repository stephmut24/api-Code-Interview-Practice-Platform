/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Role } from '@/enums/enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    name: 'firstName',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    name: 'lastName',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    name: 'email',
  })
  //@IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    name: 'password',
  })
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'The·password·must·have·at least·8·characters',
    },
  )
  password: string;

  @ApiProperty({
    type: 'string',
    default: Role.USER,
    enum: Role,
    name: 'role',
  })
  @IsString()
  role: Role;
}
