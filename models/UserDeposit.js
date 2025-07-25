import mongoose from 'mongoose';
const { Schema } = mongoose;

const IncomeSchema = new Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  income_amount_in_second: { type: Number, required: true },
});

const UserDepositSchema = new Schema({
  deposit_id: {
    type: String,
    required: true,
    index: true,
  },
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  income: {
    type: [IncomeSchema],
    required: true,
  },
  deposit_amount: {
    type: Number,
    required: true,
  },
  last_time_updated_process_speeed: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Number,
    required: true,
  },
});

export const UserDeposit = mongoose.model('UserDeposit', UserDepositSchema, 'user_deposit');
