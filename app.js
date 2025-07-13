import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import mainRouter from './routes/index.js';

const app = express();

app.use(cors({
  exposedHeaders: ['Content-Range', 'X-Total-Count']
}));
app.use(express.json());

connectDB();

app.use('/api', mainRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log('Available REST API endpoints:');
  console.log('- GET /api/users');
  console.log('- GET /api/users/:id');
  console.log('- GET /api/users/:userId/ton/deposits');
  console.log('- GET /api/users/:userId/ton/withdrawals');
  console.log('- GET /api/users/:userId/ton/summary');
  console.log('- CRUD /api/withdraws');
  console.log('- CRUD /api/transactions');
  console.log('- CRUD /api/manufacture_user');
  console.log('- CRUD /api/coinages');
  console.log('- CRUD /api/user_dwarves');
  console.log('- CRUD /api/tools');
  console.log('- CRUD /api/trolleys');
  console.log('- CRUD /api/deposits');
  console.log('- CRUD /api/stocks');
  console.log('- CRUD /api/mails');
  console.log('- CRUD /api/offers');
  console.log('- CRUD /api/dwarves');
  console.log('- GET /api/stats/system');
});