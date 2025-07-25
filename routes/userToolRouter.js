import { Router } from 'express';
import {
  getTools,
  getSalesman as getSalesman,
  getBuyer as getBuyer
 }from '../controllers/userToolController.js';

const router = Router();

router.get('/getTools/:userId', getTools); 
router.get('/salesman/:salesmanId', getSalesman); 
router.get('/buyer/:buyerId', getBuyer);

export default router;
