import mongoose from 'mongoose';
const { Schema } = mongoose;

// Переиспользуемый сабдокумент цены
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

const UserToolMarketOfferSchema = new Schema({
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
  user_tool_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserTool',
    required: true,
  },
  tool_id: {
    type: String,
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

export const UserToolMarketOffer = mongoose.model(
  'UserToolMarketOffer',
  UserToolMarketOfferSchema,
  'user_tool_market_offer'
);
