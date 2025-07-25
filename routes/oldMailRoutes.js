import { Router } from 'express';
import { getOldMailByUserId } from '../controllers/oldMailController.js';

const router = Router();

// Явно получаем параметры из основного маршрута
router.get('/', (req, res) => {
  // Передаем параметры из основного маршрута
  req.params.userId = req.originalUrl.split('/')[3]; // Получаем userId из URL
  return getOldMailByUserId(req, res);
});

export default router;