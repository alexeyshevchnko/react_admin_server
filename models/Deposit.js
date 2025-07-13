import mongoose from 'mongoose';

const DepositSchema = new mongoose.Schema({
  ID: Number,
  AMOUNT: Number,
  DATE: Date,
  TYPE: String
});

export const Deposit = mongoose.model('Deposit', DepositSchema);