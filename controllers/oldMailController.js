import mongoose from 'mongoose';
import { mailConnection } from '../config/database.js';
import { OldMail } from '../models/OldMail.js';

export const getOldMailByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (!userId) {
      return res.status(400).json({ error: 'Missing User ID' });
    }

    const OldMailModel = mailConnection.models.old_mail || mailConnection.model('old_mail', OldMail.schema);

    const pipeline = [
      { $match: { id: userId } },
      { $unwind: '$mail' },
      { $sort: { 'mail.DATE': -1 } }, // сортировка по убыванию даты
      {
        $facet: {
          paginated: [
            { $skip: skip },
            { $limit: limit },
            { $replaceRoot: { newRoot: '$mail' } } // достаём mail обратно как корень
          ],
          totalCount: [
            { $count: 'total' }
          ]
        }
      }
    ];

    const result = await OldMailModel.aggregate(pipeline);

    const mail = result[0]?.paginated || [];
    const total = result[0]?.totalCount[0]?.total || 0;

    res.json({
      page,
      limit,
      total,
      mail
    });
  } catch (error) {
    console.error('Error fetching sorted paginated old mail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
