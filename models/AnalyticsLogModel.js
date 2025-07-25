import mongoose from 'mongoose';

const logEntrySchema = new mongoose.Schema({
  TIME: String,
  ACTION: String,
  TYPE: String,
  COUNT: Number,
}, { _id: false });

const infoItemSchema = new mongoose.Schema({
  DAY: Number,
  LOG: [logEntrySchema],
}, { _id: false });

export const analyticsLogSchema = new mongoose.Schema({
  ID: String,
  INFO: [infoItemSchema],
});
