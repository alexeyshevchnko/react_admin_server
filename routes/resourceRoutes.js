import { Router } from 'express';
import { createStandardController } from '../controllers/baseController.js';
import {
  Withdraw, Transaction, ManufactureUser, UserDwarfs,
  Tool, Trolley, Deposit, Stock, Mail, Offer, Dwarf
} from '../models/index.js';

const router = Router();

const resources = [
  { route: 'withdraws', model: Withdraw },
  { route: 'transactions', model: Transaction },
  { route: 'manufacture_user', model: ManufactureUser },
  { route: 'user_dwarves', model: UserDwarfs },
  { route: 'tools', model: Tool },
  { route: 'trolleys', model: Trolley },
  { route: 'deposits', model: Deposit },
  { route: 'stocks', model: Stock },
  { route: 'mails', model: Mail },
  { route: 'offers', model: Offer },
  { route: 'dwarves', model: Dwarf }
];

resources.forEach(({ route, model }) => {
  const controller = createStandardController(model, route);
  router.get(`/${route}`, controller.list);
  router.get(`/${route}/:id`, controller.getOne);
  router.post(`/${route}`, controller.create);
  router.put(`/${route}/:id`, controller.update);
  router.delete(`/${route}/:id`, controller.delete);
});

export default router;