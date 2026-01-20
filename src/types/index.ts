import { Role } from '@/enums/enums';

export interface CurrentUserType {
  sub: string;
  role: Role;
  iat?: number;
  exp?: number;
}
