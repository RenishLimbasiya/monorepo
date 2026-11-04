import type { RequestHandler } from 'express';
import { userService } from './user.service.js';
import type { ApiSuccess } from '../../shared/types/api.types.js';
import type { UpdateUserInput, UserIdParams, UserResponse } from './user.types.js';

export const userController = {
  fetchById: (async (req, res) => {
    const user = await userService.fetchUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
  }) satisfies RequestHandler<UserIdParams, ApiSuccess<UserResponse>>,

  update: (async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({ success: true, data: user });
  }) satisfies RequestHandler<UserIdParams, ApiSuccess<UserResponse>, UpdateUserInput>,

  remove: (async (req, res) => {
    await userService.deleteUser(req.params.id);
    res.status(204).end();
  }) satisfies RequestHandler<UserIdParams, void>,
};
