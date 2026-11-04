import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../middleware/validate.middleware.js';
import { authController } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.validation.js';

const authRouter = express.Router();

const authRateLimit = (limit: number) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many authentication attempts. Try again later.',
        },
      });
    },
  });

authRouter.post(
  '/register',
  authRateLimit(5),
  validateBody(registerSchema),
  authController.register,
);
authRouter.post('/login', authRateLimit(10), validateBody(loginSchema), authController.login);
authRouter.get('/me', authMiddleware, authController.me);

export default authRouter;
