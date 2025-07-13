import mongoose from 'mongoose';

const CoinageSchema = new mongoose.Schema({
  ID: Number,
  MATERIAL: String,
  AMOUNT: Number,
  DATE: Date,
  TYPE: String
});

export const Coinage = mongoose.model('Coinage', CoinageSchema);