import type { RequestHandler } from 'express';
import { authService } from './auth.service.js';
import type { AuthResult } from './auth.types.js';
import type { LoginInput, RegisterInput } from './auth.validation.js';
import type { ApiSuccess } from '../../shared/types/api.types.js';
import { AppError } from '../../shared/errors/app.error.js';
import { userService } from '../user/user.service.js';
import type { UserResponse } from '../user/user.types.js';

export const authController = {
  register: (async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  }) satisfies RequestHandler<never, ApiSuccess<AuthResult>, RegisterInput>,

  login: (async (req, res) => {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  }) satisfies RequestHandler<never, ApiSuccess<AuthResult>, LoginInput>,

  me: (async (req, res) => {
    if (!req.auth) {
      throw new AppError(401, 'AUTHENTICATION_REQUIRED', 'A valid bearer token is required.');
    }

    const user = await userService.fetchUserById(req.auth.userId);
    res.status(200).json({ success: true, data: user });
  }) satisfies RequestHandler<never, ApiSuccess<UserResponse>>,
};
