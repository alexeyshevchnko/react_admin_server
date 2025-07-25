import mongoose from 'mongoose';

// --- Reward схемы ---
const RewardSchema = new mongoose.Schema({
  TYPE: { type: String, required: true },
  COUNT: { type: Number, required: true }
}, { _id: false });

const PuzzleRewardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  count: { type: Number, required: true }
}, { _id: false });

// --- LANGUAGE ---
const LanguageSchema = new mongoose.Schema({
  TYPE: { type: String, required: true },
  TITLE: { type: String, required: true },
  DESCRIPTION: { type: String, required: true }
}, { _id: false });

// --- Mail Item ---
const MailItemSchema = new mongoose.Schema({
  KEY: { type: String, required: true },
  STATUS: { type: String, required: true },
  DATE: { type: Date, required: true },

  LANGUAGE: { type: [LanguageSchema], default: [] },
  REWARDS: { type: [RewardSchema], default: [] },
  REWARDS_PUZZLE: { type: [PuzzleRewardSchema], default: [] },
  REWARDS_DWARF: { type: [PuzzleRewardSchema], default: [] },
  REWARDS_STOCK: { type: [PuzzleRewardSchema], default: [] }
}, { _id: true });

// --- Корневая схема ---
const OldMailSchema = new mongoose.Schema({
  id: { type: String, required: true }, // это ID пользователя
  mail: { type: [MailItemSchema], default: [] }
}, {
  versionKey: false,
  timestamps: false,
  collection: 'mail_old'
});

export const OldMail = mongoose.model('old_mail', OldMailSchema);
