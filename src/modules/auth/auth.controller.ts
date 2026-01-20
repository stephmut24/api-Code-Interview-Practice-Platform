// auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') // Ajoutez 'login' au chemin
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
