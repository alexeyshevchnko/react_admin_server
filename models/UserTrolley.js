import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserTrolleySchema = new Schema({
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  trolley_id: {
    type: String,
    required: true,
  },
  mint_attempts: Number,
  open: Boolean,
  trolleyIdAfterOpen: String,
  cooldown_date: Number,
  ore_collected_at: Number,
  ton_collected_at: Number,
  ore_mined: Number,
  ton_mined: Number,
  created_at: Number,
  status: String,
  deleted: {
    type: Boolean,
    default: false,
    index: true,
  },
});

export const UserTrolley = mongoose.model(
  'UserTrolley',
  UserTrolleySchema,
  'user_trolley' 
);
