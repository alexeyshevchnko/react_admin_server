import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  ID: { type: String, required: true, index: true, unique: true },
  REGISTRATION: { type: Date, default: Date.now },
  NICKNAME: { type: String, index: true },
  WALLET: { type: String, index: true },
  PURCHASES: [{
    item: String,
    amount: Number,
    date: { type: Date, default: Date.now }
  }],
  CURRENCIES: [{
    TYPE: String,
    COUNT: Number
  }],
  CURRENCIES_SPEND: [{
    TYPE: String,
    COUNT: Number
  }],
  MINE_LEVEL: Number,
  LAST_DAY_ONLINE: Date,
  REFERRALS: [String]
}, { strict: false });

export const User = mongoose.model('User', UserSchema);