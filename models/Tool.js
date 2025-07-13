import mongoose from 'mongoose';

const ToolSchema = new mongoose.Schema({
  ID: Number,
  NAME: String,
  DURABILITY: Number,
  DATE: Date
});

export const Tool = mongoose.model('Tool', ToolSchema);