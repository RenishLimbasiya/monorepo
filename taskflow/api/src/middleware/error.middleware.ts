import type { ErrorRequestHandler } from 'express';
import { logger } from '../config/logger.config.js';
import { AppError } from '../shared/errors/app.error.js';
import type { ApiError } from '../shared/types/api.types.js';

type ErrorWithCode = Error & {
  code?: string;
  meta?: { target?: unknown };
  type?: string;
};

const getPrismaError = (error: ErrorWithCode): AppError | undefined => {
  if (error.code === 'P2002') {
    return new AppError(
      409,
      'RESOURCE_CONFLICT',
      'A record with these unique values already exists.',
      {
        target: error.meta?.target,
      },
    );
  }

  if (error.code === 'P2025') {
    return new AppError(404, 'RESOURCE_NOT_FOUND', 'The requested record was not found.');
  }

  if (error.code === 'P2003') {
    return new AppError(
      409,
      'RELATION_CONFLICT',
      'The requested change conflicts with related data.',
    );
  }

  return undefined;
};

export const errorMiddleware: ErrorRequestHandler = (error: unknown, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const sourceError: ErrorWithCode =
    error instanceof Error ? (error as ErrorWithCode) : new Error('Unknown error');
  const parserError =
    sourceError.type === 'entity.parse.failed'
      ? new AppError(400, 'INVALID_JSON', 'Request body contains invalid JSON.')
      : sourceError.type === 'entity.too.large'
        ? new AppError(413, 'PAYLOAD_TOO_LARGE', 'Request body exceeds the 1 MB limit.')
        : undefined;
  const appError = error instanceof AppError ? error : (parserError ?? getPrismaError(sourceError));
  const statusCode = appError?.statusCode ?? 500;
  const code = appError?.code ?? 'INTERNAL_SERVER_ERROR';
  const message = appError?.message ?? 'An unexpected error occurred.';

  if (statusCode >= 500) {
    logger.error({ err: sourceError, requestId: req.requestId }, 'Request failed');
  } else {
    logger.warn({ code, requestId: req.requestId }, message);
  }

  const response: ApiError = {
    success: false,
    error: {
      code,
      message,
      ...(appError?.details === undefined ? {} : { details: appError.details }),
      requestId: req.requestId,
    },
  };

  res.status(statusCode).json(response);
};
