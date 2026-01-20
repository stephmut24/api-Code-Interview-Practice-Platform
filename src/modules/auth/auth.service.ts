import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { comparePassword } from '@/utils';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'node_modules/bcryptjs';
//import { Role } from '@/enums/enums';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginData: LoginDto) {
    this.logger.debug(`Login attempt for: ${loginData.email}`);

    const user = await this.userService.findByEmail(loginData.email);

    if (!user) {
      this.logger.warn(`User not found: ${loginData.email}`);
      throw new UnauthorizedException('Email or Password is Wrong');
    }

    this.logger.debug(`User found: ${user.email}`);
    this.logger.debug(
      `Stored password hash: ${user.password?.substring(0, 20)}...`,
    );

    const directCompare = await bcrypt.compare(
      loginData.password,
      user.password,
    );
    this.logger.debug(`Direct bcrypt compare result: ${directCompare}`);

    const passwordMatch = await comparePassword(
      loginData.password,
      user.password,
    );

    this.logger.debug(`comparePassword result: ${passwordMatch}`);

    if (!passwordMatch) {
      this.logger.warn(`Password mismatch for user: ${user.email}`);
      // Log plus d'infos
      console.log('Login password:', loginData.password);
      console.log('Stored hash:', user.password);
      throw new UnauthorizedException('Email or Password is Wrong');
    }

    this.logger.log(`Successful login for user: ${user.email}`);
    // Assurez-vous que le payload correspond à CurrentUserType
    const payload = {
      sub: user.id,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
