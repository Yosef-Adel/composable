import { UserRole } from '../../users/user.schema';

export type JwtPayload = {
  sub: string; // user id
  email: string;
  roles: UserRole[];
  iat?: number;
  exp?: number;
};
