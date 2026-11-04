import userRouter from '../modules/user/user.router.js';
import authRouter from '../modules/auth/auth.router.js';

export const routeConfig = [
  { path: '/auth', router: authRouter },
  { path: '/user', router: userRouter },
];
