import mongoose from 'mongoose';
const { Schema } = mongoose;

const ShopStockHistorySchema = new Schema({
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  sales_id: {
    type: Number,
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

export const ShopStockHistory = mongoose.model(
  'ShopStockHistory',
  ShopStockHistorySchema,
  'shop_stock_history' 
);
