import { Role } from '@/enums/enums';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@/common/decorator/role.decorator'; // Utilisez ROLES_KEY au lieu de ROLEKE
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CurrentUserType } from '@/types';

interface JwtError extends Error {
  name: string;
  message: string;
}

interface RequestWithUser extends Request {
  user: CurrentUserType;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    // Utilisez ROLES_KEY
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Unauthorized Request');
    }

    try {
      const user = await this.jwtService.verifyAsync<CurrentUserType>(token);
      request.user = user;

      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      const hasRequiredRole = requiredRoles.includes(user.role);

      if (!hasRequiredRole) {
        throw new UnauthorizedException('Unauthorized Request');
      }

      return true;
    } catch (error) {
      const jwtError = error as JwtError;
      if (jwtError.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      if (jwtError.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      throw error;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
