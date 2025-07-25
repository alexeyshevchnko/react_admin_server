import { UserDeposit } from '../models/index.js';

export const getUserDepositsWithWithdraws = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await UserDeposit.aggregate([
      { $match: { user_id: userId } },
      {
        $lookup: {
          from: 'user_deposit_withdraw',
          localField: '_id',
          foreignField: 'user_deposit_id',
          as: 'withdraws'
        }
      }
    ]);

    res.json(data);
  } catch (error) {
    console.error('Ошибка при получении депозитов:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};
