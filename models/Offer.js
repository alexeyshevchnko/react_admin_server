import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema({
  ID: Number,
  TYPE: String,
  ITEM: String,
  AMOUNT: Number,
  PRICE: Number,
  STATUS: String,
  DATE: Date,
  BUYER_ID: Number,
  SELLER_ID: Number
});

export const Offer = mongoose.model('Offer', OfferSchema);