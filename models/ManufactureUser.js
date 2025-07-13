import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProcessCicleSchema = new Schema({
  to_currensy_type: { type: String, required: true },
  to_currensy_amount: { type: Number, required: true },
  sort: { type: Number, default: 0 },
  progress_percent: { type: Number, default: 0 },
}, { _id: false });

const ManufactureUserSchema = new Schema({
  user_id: { type: String, required: true, index: true },
  level: { type: Number, required: true },
  manufacture_id: { type: String, required: true },
  process_speed_in_second: { type: Number, required: true },
  last_time_updated_process_speeed: { type: Number, required: true },
  process_cicle: { type: [ProcessCicleSchema], default: [] },
  status: { type: String, enum: ['active', 'inactive'], required: true },
  created_at: { type: Number, required: true }
});

export const ManufactureUser = mongoose.model('ManufactureUser', ManufactureUserSchema);
