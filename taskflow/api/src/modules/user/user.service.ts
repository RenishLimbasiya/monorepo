import { AppError } from '../../shared/errors/app.error.js';
import { hashPassword } from '../../shared/utils/password.util.js';
import { userRepository } from './user.repository.js';
import type { UpdateUserInput } from './user.types.js';

export const userService = {
  fetchUserById: async (id: string) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User was not found.');
    }
    return user;
  },

  updateUser: async (id: string, input: UpdateUserInput) => {
    const passwordHash = input.password ? await hashPassword(input.password) : undefined;
    return userRepository.updateById(id, input, passwordHash);
  },

  deleteUser: (id: string) => userRepository.deleteById(id),
};
