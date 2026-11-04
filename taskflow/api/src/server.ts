import { app } from './app.js';
import { prisma } from './database/prisma.client.js';

const port = Number(process.env.PORT || 3000);

const start = async (): Promise<void> => {
  await prisma.$connect();

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`API listening on http://0.0.0.0:${port}`);
  });

  const shutdown = (signal: NodeJS.Signals): void => {
    console.log(`${signal} received; closing API server.`);
    server.close(() => {
      void prisma.$disconnect().finally(() => process.exit(0));
    });
  };

  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
};

start().catch((error: unknown) => {
  console.error('Failed to start API or connect to PostgreSQL.', error);
  process.exitCode = 1;
});
