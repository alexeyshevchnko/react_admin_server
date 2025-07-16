import mongoose from 'mongoose';
const { Schema } = mongoose;

const PriceSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['MMToken', 'Ton'], 
  },
  amount: {
    type: Number,
    required: true,
  },
}, { _id: false });

const UserStockMarketOfferSchema = new Schema({
  salesman_user_id: {
    type: String,
    required: true,
    index: true,
  },
  buyer_user_id: {
    type: String,
    default: '',
    index: true,
  },
  user_stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserStock',
    required: true,
  },
  price: {
    type: PriceSchema,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'sold', 'closed'],
    index: true,
  },
  created_at: {
    type: Number, 
    required: true,
  },
  end_of_bidding_at: {
    type: Number,
    required: true,
  },
});

export const UserStockMarketOffer = mongoose.model(
  'UserStockMarketOffer',
  UserStockMarketOfferSchema,
  'user_stock_market_offers' 
);
