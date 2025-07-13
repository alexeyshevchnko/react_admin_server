import { Router } from 'express';
import userRoutes from './userRoutes.js';
import tonRoutes from './tonRoutes.js';
import resourceRoutes from './resourceRoutes.js';
import statsRoutes from './statsRoutes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/users/:userId/ton', tonRoutes);
router.use('/', resourceRoutes);
router.use('/stats', statsRoutes);

export default router;