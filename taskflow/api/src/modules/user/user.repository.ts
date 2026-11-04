import { randomUUID } from 'node:crypto';
import { prisma } from '../../database/prisma.client.js';
import type { CreateUserInput, UpdateUserInput } from './user.types.js';

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const userRepository = {
  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    }),

  findByEmailForAuth: (email: string) =>
    prisma.user.findUnique({
      where: { email },
      select: { ...publicUserSelect, password: true },
    }),

  create: (input: CreateUserInput, passwordHash: string) =>
    prisma.user.create({
      data: {
        id: randomUUID(),
        email: input.email,
        name: input.name,
        password: passwordHash,
      },
      select: publicUserSelect,
    }),

  updateById: (id: string, input: UpdateUserInput, passwordHash?: string) =>
    prisma.user.update({
      where: { id },
      data: {
        email: input.email,
        name: input.name,
        ...(passwordHash ? { password: passwordHash } : {}),
      },
      select: publicUserSelect,
    }),

  deleteById: (id: string) =>
    prisma.user.delete({
      where: { id },
      select: publicUserSelect,
    }),
};
