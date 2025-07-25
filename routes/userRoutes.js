import { Router } from 'express';
import userController from '../controllers/userController.js';

const router = Router();

router.get('/', userController.list);
router.get('/byTelegramId/:id', userController.getOneByID);
router.get('/:id', userController.getOne);

export default router;