import { Router } from 'express';
import {
  getAnalyticsCollections,
  getAnalyticsDayRange, 
  getAnalyticsLogsByDayRange
} from '../controllers/analyticsController.js';

const router = Router();

router.get('/logs', getAnalyticsLogsByDayRange);
router.get('/day-range', getAnalyticsDayRange);
router.get('/collections', getAnalyticsCollections);


export default router;
