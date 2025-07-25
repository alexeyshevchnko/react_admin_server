import mongoose from 'mongoose';

const MAIN_DB_URI = 'mongodb://localhost:27017/money_mining_db';
const ANALYTICS_DB_URI = 'mongodb://localhost:27017/money_mining_db_analytics';
const MAIL_DB_URI = 'mongodb://localhost:27017/mail'; // Изменил на 'mail' вместо 'mail_db'

export const mainConnection = mongoose; // основное подключение

export const analyticsConnection = mongoose.createConnection(ANALYTICS_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const mailConnection = mongoose.createConnection(MAIL_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const connectDB = async () => {
  try {
    await mainConnection.connect(MAIN_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    analyticsConnection.on('connected', () => {
      console.log('✅ Analytics DB connected');
    });

    analyticsConnection.on('error', (err) => {
      console.error('❌ Analytics DB connection error:', err);
    });

    mailConnection.on('connected', () => {
      console.log('✅ Mail DB connected');
    });

    mailConnection.on('error', (err) => {
      console.error('❌ Mail DB connection error:', err);
    });

    console.log('✅ Main DB connected');
  } catch (err) {
    console.error('❌ Main DB connection error:', err);
    process.exit(1);
  }
};