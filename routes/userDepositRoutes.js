import express from 'express';
import { getUserDepositsWithWithdraws } from '../controllers/userDepositController.js';

const router = express.Router();

router.get('/:userId', getUserDepositsWithWithdraws);

export default router;
