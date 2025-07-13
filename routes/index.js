import { Router } from 'express';
import userRoutes from './userRoutes.js';
import tonRoutes from './tonRoutes.js';
import resourceRoutes from './resourceRoutes.js';
import statsRoutes from './statsRoutes.js';
import manufactureUserRoutes from './manufactureUserRoutes.js';
import coinageUserRoutes from './coinageUserRoutes.js';  

const router = Router();

router.use('/users', userRoutes);
router.use('/users/:userId/ton', tonRoutes);
router.use('/manufacture_user', manufactureUserRoutes);
router.use('/coinage_user', coinageUserRoutes);  
router.use('/stats', statsRoutes);
router.use('/', resourceRoutes);

export default router;
