// routes/tonRoutes.js
import tonController from '../controllers/tonController.js';
import express from 'express';

const router = express.Router({ mergeParams: true });

router.get('/deposits', tonController.getUserDeposits);
router.get('/withdrawals', tonController.getUserWithdrawals);
router.get('/summary', tonController.getTonSummary);

export default router;
