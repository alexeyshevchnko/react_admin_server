import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserToolSchema = new Schema({
  tool_id: {
    type: String,
    required: true,
    index: true,
  },
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  cooldownChange: {
    type: Number,
    required: true,
    default: 0,
  },
  created_at: {
    type: Number, // Unix timestamp (в секундах или float — зависит от системы)
    required: true,
  },
});

export const UserTool = mongoose.model('UserTool', UserToolSchema, 'user_tool');
