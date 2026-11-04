import type { RequestHandler } from 'express';
import { AppError } from '../shared/errors/app.error.js';

export const requireOwnUser: RequestHandler = (req, _res, next) => {
  if (!req.auth || req.auth.userId !== req.params.id) {
    next(new AppError(403, 'FORBIDDEN', 'You can only access your own user account.'));
    return;
  }

  next();
};
