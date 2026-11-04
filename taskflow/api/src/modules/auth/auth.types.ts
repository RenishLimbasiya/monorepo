import type { UserResponse } from '../user/user.types.js';

export type AuthResult = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: UserResponse;
};
