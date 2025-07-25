import mongoose from 'mongoose';
const { Schema } = mongoose;

// Сабдокумент для цены
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

const UserTrolleyMarketOfferSchema = new Schema({
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
  user_trolley_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserTrolley',
    required: true,
  },
  price: {
    type: PriceSchema,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'closed'],
    required: true,
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

export const UserTrolleyMarketOffer = mongoose.model(
  'UserTrolleyMarketOffer',
  UserTrolleyMarketOfferSchema,
  'user_trolley_market_offer'
);
