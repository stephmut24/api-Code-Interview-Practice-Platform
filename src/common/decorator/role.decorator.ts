import { Role } from '@/enums/enums';
import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'role';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
