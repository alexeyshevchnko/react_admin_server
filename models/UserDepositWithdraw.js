import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserDepositWithdrawSchema = new Schema({
  user_deposit_id: {
    type: Schema.Types.ObjectId,
    ref: 'UserDeposit',
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  deposit_withdraw_amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true, // Например: 'CLOSED', 'PENDING'
  },
  close_time: {
    type: Number,
  },
  created_at: {
    type: Number,
    required: true,
  },
});

export const UserDepositWithdraw = mongoose.model('UserDepositWithdraw', UserDepositWithdrawSchema, 'user_deposit_withdraw');
