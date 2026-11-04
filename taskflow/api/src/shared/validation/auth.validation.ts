import { z } from 'zod';

export const emailSchema = z.email().trim().toLowerCase().max(320);

export const passwordSchema = z
  .string()
  .min(12)
  .refine((password) => Buffer.byteLength(password, 'utf8') <= 72, {
    message: 'Password must be at most 72 UTF-8 bytes.',
  });
