import mongoose from 'mongoose';

const TonWithdrawSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
    // Убрано index: true, так как индекс создается ниже через schema.index()
  },
  amount: {
    type: Number,
    required: true,
    min: 0.1
  },
  transaction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  status: {
    type: String,
    required: true,
    enum: [
      'CONFIRMED',
      'SENDED',
      'RETURNED',
      'PENDING',
      'CANCELED_ADMIN',
      'FROZEN'
    ],
    default: 'PENDING'
    // Убрано index: true, так как индекс создается ниже
  },
  commission: {
    type: Number,
    default: 0.01
  },
  wallet_address: {
    type: String,
    required: true
  },
  created_at: {
    type: Number, // Изменено с Date на Number
    default: () => Math.floor(Date.now() / 1000) // UNIX timestamp в секундах
    },
    send_at: {
    type: Number // Изменено с Date на Number
    },
    completed_at: {
    type: Number // Изменено с Date на Number
    },
    admin_comment: String
});

// Все индексы в одном месте для наглядности
TonWithdrawSchema.index({ user_id: 1 });          // Для поиска по пользователю
TonWithdrawSchema.index({ status: 1 });           // Для фильтрации по статусу
TonWithdrawSchema.index({ created_at: -1 });      // Для сортировки по дате создания
TonWithdrawSchema.index({ 
  user_id: 1, 
  status: 1 
}); // Составной индекс для частых запросов

// Хуки для логирования изменений статуса
TonWithdrawSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (['SENDED', 'CONFIRMED'].includes(this.status)) {
      this.send_at = this.send_at || Date.now();
    }
    if (this.status === 'CONFIRMED') {
      this.completed_at = Date.now();
    }
  }
  next();
});

export const TonWithdraw = mongoose.model('TonWithdraw', TonWithdrawSchema, 'ton_withdraw');