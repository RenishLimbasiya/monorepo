import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

const requestIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const incomingRequestId = req.get('x-request-id');
  const requestId =
    incomingRequestId && requestIdPattern.test(incomingRequestId)
      ? incomingRequestId
      : randomUUID();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};
