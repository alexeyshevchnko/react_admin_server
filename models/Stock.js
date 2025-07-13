import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
  ID: Number,
  ACTION: String,
  AMOUNT: Number,
  DATE: Date,
  DIVIDENDS: Number
});

export const Stock = mongoose.model('Stock', StockSchema);