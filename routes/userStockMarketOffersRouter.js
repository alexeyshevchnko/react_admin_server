import { Router } from 'express';
import {
  getOffersBySalesman,
  getPurchasesByBuyer
} from '../controllers/userStockMarketOffersController.js';

const router = Router();

// Предложения текущего пользователя (по salesman_user_id)
router.get('/salesman/:salesmanId', getOffersBySalesman);

// Покупки текущего пользователя (по buyer_user_id)
router.get('/buyer/:buyerId', getPurchasesByBuyer);

export default router;
