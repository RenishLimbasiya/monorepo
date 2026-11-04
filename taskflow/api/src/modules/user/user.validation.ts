import { z } from 'zod';
import { emailSchema, passwordSchema } from '../../shared/validation/auth.validation.js';

export const createUserSchema = z
  .object({
    email: emailSchema,
    name: z.string().trim().min(1).max(100).nullable().optional(),
    password: passwordSchema,
  })
  .strict();

export const updateUserSchema = z
  .object({
    email: emailSchema.optional(),
    name: z.string().trim().min(1).max(100).nullable().optional(),
    password: passwordSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided.',
  });

export const userIdParamsSchema = z
  .object({
    id: z.string().trim().min(1).max(64),
  })
  .strict();
