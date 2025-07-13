import { Router } from 'express';
import coinageUserController from '../controllers/coinageUserController.js';

const router = Router();

router.get('/:userId', (req, res, next) => {
  next();
}, coinageUserController.getFullCoinageInfo);

export default router;
