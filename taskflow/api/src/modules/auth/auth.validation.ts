import { z } from 'zod';
import { emailSchema, passwordSchema } from '../../shared/validation/auth.validation.js';

export const registerSchema = z
  .object({
    email: emailSchema,
    name: z.string().trim().min(1).max(100).nullable().optional(),
    password: passwordSchema,
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
