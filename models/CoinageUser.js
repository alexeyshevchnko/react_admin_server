import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProcessSpeedSchema = new Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
}, { _id: false });

const ProcessCicleSchema = new Schema({
  to_currensy_type: { type: String, required: true },
  to_currensy_amount: { type: Number, required: true },
  sort: { type: Number, default: 0 },
  progress_percent: { type: Number, default: 0 },
}, { _id: false });

const CoinageUserSchema = new Schema({
  user_id: { type: String, required: true, index: true },
  level: { type: Number, required: true },
  level_speed: { type: Number, required: true },
  level_storage_gems: { type: Number, required: true },
  level_storage_ingots: { type: Number, required: true },
  coinage_id: { type: String, required: true },
  process_speed_in_second: { type: [ProcessSpeedSchema], default: [] },
  last_time_updated_process_speeed: { type: Number, required: true },
  process_cicle: { type: [ProcessCicleSchema], default: [] },
  status: { type: String, enum: ['active', 'inactive'], required: true },
  created_at: { type: Number, required: true },
});

export const CoinageUser = mongoose.model('CoinageUser', CoinageUserSchema, 'coinage_user');
