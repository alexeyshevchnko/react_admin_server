import { Router } from 'express';
import { createStandardController } from '../controllers/baseController.js';
import {
  Withdraw, ManufactureUser, UserDwarfs,
  Trolley, Deposit, Stock, Mail, Offer, Dwarf,
  UserStock
} from '../models/index.js';

const router = Router();

const resources = [
  { route: 'withdraws', model: Withdraw }, 
  { route: 'manufacture_user', model: ManufactureUser },
  { route: 'user_dwarves', model: UserDwarfs },
  { route: 'trolleys', model: Trolley },
  { route: 'deposits', model: Deposit },
  { route: 'stocks', model: Stock },
  { route: 'mails', model: Mail },
  { route: 'offers', model: Offer },
  { route: 'dwarves', model: Dwarf },
  { route: 'user_stocks', model: UserStock, populate: ['stock_id'] }  
];

resources.forEach(({ route, model, populate }) => {
  const controller = createStandardController(model, route, { populate });
  router.get(`/${route}`, controller.list);
  router.get(`/${route}/:id`, controller.getOne);
  router.post(`/${route}`, controller.create);
  router.put(`/${route}/:id`, controller.update);
  router.delete(`/${route}/:id`, controller.delete);
});

export default router;
