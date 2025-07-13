import mongoose from 'mongoose';

const TrolleySchema = new mongoose.Schema({
  ID: Number,
  LEVEL: Number,
  DATE: Date
});

export const Trolley = mongoose.model('Trolley', TrolleySchema);