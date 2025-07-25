import { Router } from 'express';
import userRoutes from './userRoutes.js';
import tonRoutes from './tonRoutes.js';
import resourceRoutes from './resourceRoutes.js';
import statsRoutes from './statsRoutes.js';
import manufactureUserRoutes from './manufactureUserRoutes.js';
import coinageUserRoutes from './coinageUserRoutes.js'; 
import userStockMarketOffersRouter from './userStockMarketOffersRouter.js';
import getUserShopHistoryDetailed from './getUserShopHistoryRouter.js';
import tools from './userToolRouter.js';
import trolleys from './userTrolleyRouter.js';  
import userDepositRoutes from './userDepositRoutes.js';  
import analyticsRouter from './analyticsRouter.js';
import oldMailRoutes from  './oldMailRoutes.js'; 
import { getOldMailByUserId } from '../controllers/oldMailController.js';

const router = Router();

router.get('/users/:userId/old-mail', getOldMailByUserId);

router.use('/analytics', analyticsRouter);
router.use('/user-deposits', userDepositRoutes);  
router.use('/trolleys', trolleys);
router.use('/tools', tools);  
router.use('/market', getUserShopHistoryDetailed);  
router.use('/market', userStockMarketOffersRouter);  
router.use('/users', userRoutes);
router.use('/users/:userId/ton', tonRoutes);
router.use('/manufacture_user', manufactureUserRoutes);
router.use('/coinage_user', coinageUserRoutes);  
router.use('/stats', statsRoutes);

router.use('/', resourceRoutes);

export default router;

