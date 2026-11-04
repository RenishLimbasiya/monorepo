import type { z } from 'zod';
import type { UserModel } from '../../generated/prisma/models.js';
import type { createUserSchema, updateUserSchema, userIdParamsSchema } from './user.validation.js';

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type UserResponse = Omit<UserModel, 'password'>;
