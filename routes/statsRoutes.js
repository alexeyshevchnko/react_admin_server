import { Router } from 'express';
import { User, Transaction, Offer } from '../models/index.js';

const router = Router();

router.get('/system', async (req, res) => {
  try {
    const [userCount, transactionStats, offerStats] = await Promise.all([
      User.countDocuments(),
      Transaction.aggregate([
        { $group: {
          _id: '$TYPE',
          totalAmount: { $sum: '$value' },
          count: { $sum: 1 }
        }}
      ]),
      Offer.aggregate([
        { $match: { STATUS: 'COMPLETED' } },
        { $group: {
          _id: '$TYPE',
          totalVolume: { $sum: '$PRICE' },
          totalItems: { $sum: '$AMOUNT' }
        }}
      ])
    ]);

    res.json({
      users: userCount,
      transactions: transactionStats,
      offers: offerStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;