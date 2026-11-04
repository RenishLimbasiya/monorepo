import { randomUUID } from 'node:crypto';
import { pinoHttp } from 'pino-http';
import { logger } from '../config/logger.config.js';

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => (req as typeof req & { requestId?: string }).requestId ?? randomUUID(),
  customLogLevel: (_req, res, error) => {
    if (error || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});
