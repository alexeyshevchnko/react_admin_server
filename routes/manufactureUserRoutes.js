import { Router } from 'express';
import manufactureUserController from '../controllers/manufactureUserController.js';

const router = Router();

router.get('/', (req, res, next) => {
  next();
}, manufactureUserController.getAll);

router.get('/:id', (req, res, next) => {
  next();
}, manufactureUserController.getOne);

router.post('/', (req, res, next) => {
  next();
}, manufactureUserController.create);

router.put('/:id', (req, res, next) => {
  next();
}, manufactureUserController.update);

router.delete('/:id', (req, res, next) => {
  next();
}, manufactureUserController.remove);

export default router;
