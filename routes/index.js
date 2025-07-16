import { Router } from 'express';
import userRoutes from './userRoutes.js';
import tonRoutes from './tonRoutes.js';
import resourceRoutes from './resourceRoutes.js';
import statsRoutes from './statsRoutes.js';
import manufactureUserRoutes from './manufactureUserRoutes.js';
import coinageUserRoutes from './coinageUserRoutes.js'; 
import userStockMarketOffersRouter from './userStockMarketOffersRouter.js';

const router = Router();
 
router.use('/market', userStockMarketOffersRouter);  
router.use('/users', userRoutes);
router.use('/users/:userId/ton', tonRoutes);
router.use('/manufacture_user', manufactureUserRoutes);
router.use('/coinage_user', coinageUserRoutes);  
router.use('/stats', statsRoutes);

// 3. Общие роуты (должны быть последними)
router.use('/', resourceRoutes);

export default router;