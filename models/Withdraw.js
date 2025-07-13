import mongoose from 'mongoose';


const WithdrawSchema = new mongoose.Schema({
  ID: Number,
  AMOUNT: Number,
  DATE: Date,
  STATUS: String
});

export const Withdraw = mongoose.model('Withdraw', WithdrawSchema);