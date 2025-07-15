import { User, Transaction, Withdraw, TonWithdraw } from '../models/index.js';

export default {
  
    async getUserDeposits(req, res) {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) return res.status(404).json({ error: 'User not found' }); 

            const deposits = await Transaction.find({
                status: 'complete',
                'in_msg.source': user.WALLET
            }).sort({ created_at: -1 });

            // Конвертируем наноTON в TON
            const formattedDeposits = deposits.map(tx => ({
                id: tx._id.toString(),
                amount: parseInt(tx.in_msg.value) / 1000000000,
                txHash: tx.txHash,
                date: tx.created_at,
                ...tx.toObject()
            }));

            res.json(formattedDeposits);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    },

    async getUserWithdrawals(req, res) {
        try {
            const userId = req.params.userId.toString(); // Приводим к строке
            const withdrawals = await TonWithdraw.find({ 
                user_id: userId // Ищем по строке, а не ObjectId
            }).sort({ created_at: -1 });
            
            res.json(withdrawals.map(wd => ({
                id: wd._id.toString(),
                ...wd.toObject()
            })));
        } catch (error) {
            console.error('Ошибка:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async getTonSummary(req, res) {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) return res.status(404).json({ error: 'User not found' });
            

            const [deposits, withdrawals] = await Promise.all([
                Transaction.find({
                    status: 'complete',
                    'in_msg.source': user.WALLET
                }),
                Withdraw.find({ 
                    user_id: req.params.userId,
                    status: 'CONFIRMED'
                })
            ]);

            const totalDeposits = deposits.reduce((sum, tx) => {
                return sum + parseInt(tx.in_msg?.value || '0') / 1000000000;
            }, 0);

            const totalWithdrawals = withdrawals.reduce((sum, wd) => {
                return sum + wd.amount;
            }, 0);

            res.json({
                totalDeposits,
                totalWithdrawals,
                balance: totalDeposits - totalWithdrawals
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};