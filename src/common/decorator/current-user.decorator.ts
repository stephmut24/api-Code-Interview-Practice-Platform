// common/decorators/current-user.decorator.ts
import { CurrentUserType } from '@/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserType => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();

    // Vérification de type sécurisée
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!request.user) {
      throw new Error(
        'User not found in request - AuthGuard may not be applied',
      );
    }

    // Type assertion avec vérification
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = request.user as CurrentUserType;

    // Validation optionnelle des propriétés requises
    if (!user.sub || !user.role) {
      throw new Error('Invalid user object in request');
    }

    return user;
  },
);
