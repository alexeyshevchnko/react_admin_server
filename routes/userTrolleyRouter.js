import { Router } from 'express';
import {
  getUserTrolleys,
  getUserTrolleyById,
  getUserTrolleysGrouped,
  getTrolleysByTypeAndUser,
  getBuyer,
  getSalesman
} from '../controllers/userTrolleyController.js';

const router = Router();

router.get('/getTrolleysGrouped/:userId', getUserTrolleysGrouped);
router.get('/getTrolleysByType', getTrolleysByTypeAndUser);
router.get('/getTrolleys/:userId', getUserTrolleys);

// Эндпоинты для UserTrolleyMarketOffer
router.get('/buyer/:buyerId', getBuyer);
router.get('/salesman/:salesmanId', getSalesman);


router.get('/getTrolley/:id', getUserTrolleyById);

export default router;
