import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../shared/errors/app.error.js';

export const validateBody =
  <T>(schema: ZodType<T>): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(
        new AppError(
          400,
          'VALIDATION_ERROR',
          'Request body is invalid.',
          result.error.issues.map(({ code, message, path }) => ({ code, message, path })),
        ),
      );
      return;
    }

    req.body = result.data;
    next();
  };

export const validateParams =
  <T>(schema: ZodType<T>): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      next(
        new AppError(
          400,
          'VALIDATION_ERROR',
          'Request path parameters are invalid.',
          result.error.issues.map(({ code, message, path }) => ({ code, message, path })),
        ),
      );
      return;
    }

    Object.assign(req.params, result.data);
    next();
  };
