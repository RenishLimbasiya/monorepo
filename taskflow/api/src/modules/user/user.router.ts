import express from 'express';
import { userController } from './user.controller.js';
import { validateBody, validateParams } from '../../middleware/validate.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireOwnUser } from '../../middleware/authorization.middleware.js';
import { updateUserSchema, userIdParamsSchema } from './user.validation.js';

const userRouter = express.Router();

userRouter.use(authMiddleware);
userRouter.get(
  '/:id',
  validateParams(userIdParamsSchema),
  requireOwnUser,
  userController.fetchById,
);
userRouter.patch(
  '/:id',
  validateParams(userIdParamsSchema),
  requireOwnUser,
  validateBody(updateUserSchema),
  userController.update,
);
userRouter.delete(
  '/:id',
  validateParams(userIdParamsSchema),
  requireOwnUser,
  userController.remove,
);

export default userRouter;
