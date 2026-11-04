import { PrismaClient } from '../generated/prisma/client.js';
import { adapter } from './database.js';
export const prisma = new PrismaClient({ adapter });
