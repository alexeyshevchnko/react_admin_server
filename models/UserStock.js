import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserStockSchema = new Schema({
  stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true,
  },
  stock_amount: {
    type: Number,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  income_mmt_current: {
    type: Number,
    required: true,
  },
  income_mmt_all: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Number, // Unix timestamp
    required: true,
  },
});

export const UserStock = mongoose.model('UserStock', UserStockSchema, 'user_stock');
