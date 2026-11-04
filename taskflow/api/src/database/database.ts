import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to connect Prisma to PostgreSQL.');
}

export const adapter = new PrismaPg({ connectionString });
