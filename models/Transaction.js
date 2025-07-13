import mongoose from 'mongoose';

const InMsgSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    trim: true,
    index: true // Добавляем индекс здесь для in_msg.source
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true
  },
  fwd_fee: String,
  ihr_fee: String,
  created_lt: String,
  message: String
}, { _id: false });

const OutMsgSchema = new mongoose.Schema({
  source: String,
  destination: String,
  value: String,
  fwd_fee: String,
  ihr_fee: String,
  created_lt: String,
  message: String
}, { _id: false });

const TransactionSchema = new mongoose.Schema({
  txHash: {
    type: String,
    required: true,
    unique: true // Оставляем unique здесь, убираем дублирующий индекс
  },
  lt: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['complete', 'pending', 'failed'],
    default: 'pending',
    index: true // Добавляем индекс здесь для status
  },
  in_msg: {
    type: InMsgSchema,
    required: true
  },
  out_msgs: {
    type: [OutMsgSchema],
    default: []
  },
  created_lt: {
    type: Number, 
    default: () => 0
  },
  updated_at: {
    type: Number, 
    default: () => 0
  }
});
 
// Хук для обновления даты изменения
TransactionSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});



export const Transaction = mongoose.model('Transaction', TransactionSchema);