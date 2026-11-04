import express, { type Response, type Request } from 'express';
import { routeConfig } from './route.config.js';
const router = express.Router();

router.get('/hello', (req: Request, res: Response) => {
  res.send({ message: 'Helllo world' });
});

routeConfig.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
