import { AppError } from '../../shared/errors/app.error.js';
import { hashPassword, verifyPassword } from '../../shared/utils/password.util.js';
import { userRepository } from '../user/user.repository.js';
import type { AuthResult } from './auth.types.js';
import { accessTokenLifetimeSeconds, signAccessToken } from './auth.token.js';
import type { LoginInput, RegisterInput } from './auth.validation.js';

const buildAuthResult = async (user: {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Promise<AuthResult> => ({
  accessToken: await signAccessToken({ userId: user.id, email: user.email }),
  tokenType: 'Bearer',
  expiresIn: accessTokenLifetimeSeconds,
  user,
});

export const authService = {
  register: async (input: RegisterInput): Promise<AuthResult> => {
    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create(input, passwordHash);
    return buildAuthResult(user);
  },

  login: async (input: LoginInput): Promise<AuthResult> => {
    const user = await userRepository.findByEmailForAuth(input.email);

    if (!user) {
      await hashPassword(input.password);
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
    }

    const passwordMatches = await verifyPassword(input.password, user.password);
    if (!passwordMatches) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
    }

    const publicUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return buildAuthResult(publicUser);
  },
};
