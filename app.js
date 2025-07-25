import express from 'express';
import cors from 'cors';
import { connectDB, analyticsConnection } from './config/database.js';
import mainRouter from './routes/index.js';

const app = express();

app.use(cors({
  exposedHeaders: ['Content-Range', 'X-Total-Count']
}));
app.use(express.json());

// Ждём подключения БД перед запуском сервера
const startServer = async () => {
  await connectDB();

  // После подключения аналитики сохраняем объект db в app
  app.set('analyticsDB', analyticsConnection.db);

  app.use('/api', mainRouter);

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
};

startServer();
