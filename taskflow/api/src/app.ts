import express, { type Express } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import router from './routes/index.js';
import { prisma } from './database/prisma.client.js';
import { requestIdMiddleware } from './middleware/request_id.middleware.js';
import { requestLogger } from './middleware/logger.middleware.js';
import { notFoundMiddleware } from './middleware/not_found.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';

export const app: Express = express();

app.set('trust proxy', 1);
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

app.use('/api/v1', router);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
