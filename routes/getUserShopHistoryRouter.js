import { Router } from 'express';
import {
  getUserShopHistoryDetailed 
} from '../controllers/shopHistoryController.js';

const router = Router(); 
router.get('/shophistory/:user_id', getUserShopHistoryDetailed);
 
export default router;
