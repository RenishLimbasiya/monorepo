import type { RequestHandler } from 'express';
import { AppError } from '../shared/errors/app.error.js';
import { verifyAccessToken } from '../modules/auth/auth.token.js';

export const authMiddleware: RequestHandler = async (req, _res, next) => {
  const authorization = req.get('authorization');
  const match = authorization?.match(/^Bearer\s+([^\s]+)$/i);

  if (!match) {
    next(new AppError(401, 'AUTHENTICATION_REQUIRED', 'A valid bearer token is required.'));
    return;
  }

  try {
    req.auth = await verifyAccessToken(match[1]);
    next();
  } catch (error) {
    next(error);
  }
};
