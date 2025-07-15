import mongoose from 'mongoose';
const { Schema } = mongoose;

const SalePriceSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['Ton', 'MMToken'], 
  },
  amount: {
    type: Number,
    required: true,
  },
}, { _id: false });

const SaleSchema = new Schema({
  salesId: { type: Number, required: true },
  start_sale: { type: Number, required: true },
  end_sale: { type: Number, required: true },
  type: { type: String, required: true, enum: ['bg', 'all'] },
  limitForUser: { type: Number, required: true },
  user_ids: { type: [String], default: [] },
}, { _id: false });

const StockSchema = new Schema({
  all_amount: { type: Number, required: true },
  sold_amount: { type: Number, required: true },
  sale_amount: { type: Number, required: true },
  type: {
    type: String,
    required: true,
    enum: ['coinage', 'dwarf', 'market', 'mine', 'tool'],
  },
  stock_income_percent: { type: Number, required: true },
  sale_price: { type: [SalePriceSchema], required: true },
  sales: { type: [SaleSchema], default: [] },
  income_mmt_all: { type: Number, required: true },
});

export const Stock = mongoose.model('Stock', StockSchema, 'stock');
