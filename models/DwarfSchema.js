import mongoose from 'mongoose';

const CraftPriceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true }
}, { _id: true });

const MiningSchema = new mongoose.Schema({
  type: { type: String, required: true },
  amount_in_second: { type: Number, required: true }
});

const ConditionWorkMineSchema = new mongoose.Schema({
  level_min: { type: Number, required: true },
  trolley_storage_bonus: { type: Number, required: true },
  mining: [MiningSchema]
});

const PuzzleSplitSchema = new mongoose.Schema({
  type: { type: String, required: true },
  min_count: { type: Number, required: true },
  max_count: { type: Number, required: true }
}, { _id: true });

const SplitSchema = new mongoose.Schema({
  puzzle: [PuzzleSplitSchema]
});

const DwarfSchema = new mongoose.Schema({
  type: { 
    type: String,
    required: true,
    enum: ['Copper', 'Emerald' ,'Silver', 'Gold','MMToken','MMTokenSoft','Ore','Ruby','Sapphire','Income','Ton','Scroll','NYTicket','NYBonusAd','Arkenstone','LuckyChip']
  },
  sort: { 
    type: Number,
    required: true
  },
  craft_price: {
    type: [CraftPriceSchema],
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: 'Должен быть указан хотя бы один craft_price'
    }
  },
  condiditon_work_mine: { // внимание на опечатку в оригинальном поле (condition_work_mine)
    type: ConditionWorkMineSchema,
    required: true
  },
  split: {
    type: SplitSchema,
    required: true
  }
}, {
  versionKey: '__v',
  timestamps: false,
  collection: 'dwarves'
});
 
DwarfSchema.index({ type: 1 });
DwarfSchema.index({ sort: 1 });

export const Dwarf = mongoose.model('Dwarf', DwarfSchema);