import mongoose from 'mongoose';

const MailSchema = new mongoose.Schema({
  ID: Number,
  MESSAGE: String,
  DATE: Date,
  STATUS: String
});

export const Mail = mongoose.model('Mail', MailSchema);