import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {
    User, Withdraw, Transaction,TonWithdraw, ManufactureUser, Coinage, 
    UserDwarfs, Tool, Trolley, Deposit, Stock, Mail, Offer, Dwarf
} from './models/index.js';

// Конфигурация приложения
const app = express();

// Middleware
app.use(cors({
    exposedHeaders: ['Content-Range', 'X-Total-Count']
}));
app.use(express.json());

// Конфигурация MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/money_mining_db';
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Подключение к MongoDB
mongoose.connect(MONGODB_URI, mongooseOptions)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// ====================== Вспомогательные функции ======================

const parseQueryParams = (req) => {
    const range = req.query.range ? JSON.parse(req.query.range) : [0, 25];
    const sort = req.query.sort ? JSON.parse(req.query.sort) : ['_id', 'ASC'];
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};

    return { range, sort, filter };
};

const applyStandardFilters = (filter) => {
    if (filter.id) {
        filter._id = Array.isArray(filter.id) 
            ? { $in: filter.id.map(id => new mongoose.Types.ObjectId(id)) }
            : new mongoose.Types.ObjectId(filter.id);
        delete filter.id;
    }
    return filter;
};

const formatResponse = (items, total, range, resourceName) => {
    const [start] = range;
    const data = items.map(item => ({
        id: item._id.toString(),
        ...item.toObject()
    }));

    return {
        data,
        headers: {
            'Content-Range': `${resourceName} ${start}-${start + items.length - 1}/${total}`,
            'Access-Control-Expose-Headers': 'Content-Range'
        }
    };
};

// ====================== Контроллеры ======================

const createStandardController = (model, resourceName) => ({
    async list(req, res) {
        try {
            const { range, sort, filter } = parseQueryParams(req);
            const [start, end] = range;
            const [sortField, sortOrder] = sort;
            const parsedFilter = applyStandardFilters(filter);

            const query = model.find(parsedFilter)
                .sort({ [sortField]: sortOrder === 'ASC' ? 1 : -1 })
                .skip(start)
                .limit(end - start + 1);

            const [items, total] = await Promise.all([
                query.exec(),
                model.countDocuments(parsedFilter)
            ]);

            const { data, headers } = formatResponse(items, total, range, resourceName);
            res.set(headers).json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const item = await model.findById(req.params.id);
            if (!item) return res.status(404).json({ error: 'Not found' });

            res.json({
                id: item._id.toString(),
                ...item.toObject()
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const item = new model({
                ...req.body,
                created_at: Math.floor(Date.now() / 1000)
            });
            await item.save();

            res.status(201).json({
                id: item._id.toString(),
                ...item.toObject()
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const item = await model.findByIdAndUpdate(
                req.params.id,
                {
                    ...req.body,
                    updated_at: Math.floor(Date.now() / 1000)
                },
                { new: true, runValidators: true }
            );

            if (!item) return res.status(404).json({ error: 'Not found' });

            res.json({
                id: item._id.toString(),
                ...item.toObject()
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const item = await model.findByIdAndDelete(req.params.id);
            if (!item) return res.status(404).json({ error: 'Not found' });

            res.json({
                id: item._id.toString(),
                ...item.toObject()
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
});

// Специальный контроллер для пользователей
const userController = {
    async list(req, res) {
        try {
            const { range, sort, filter } = parseQueryParams(req);
            const [start, end] = range;
            const [sortField, sortOrder] = sort;
            const parsedFilter = applyStandardFilters(filter);

            // Обработка сортировки по количеству покупок
            if (sortField === 'purchasesCount') {
                const aggregation = [
                    { $match: parsedFilter },
                    { $addFields: { 
                        purchasesCount: { $size: { $ifNull: ["$PURCHASES", []] } } 
                    }},
                    { $sort: { purchasesCount: sortOrder === 'ASC' ? 1 : -1 } },
                    { $skip: start },
                    { $limit: end - start + 1 }
                ];

                const [items, total] = await Promise.all([
                    User.aggregate(aggregation),
                    User.countDocuments(parsedFilter)
                ]);

                const data = items.map(item => ({
                    id: item._id?.toString() || item.ID,
                    ...item
                }));

                res.set({
                    'Content-Range': `users ${start}-${start + items.length - 1}/${total}`,
                    'Access-Control-Expose-Headers': 'Content-Range'
                });
                
                return res.json(data);
            }

            // Стандартная обработка
            const query = User.find(parsedFilter)
                .sort({ [sortField]: sortOrder === 'ASC' ? 1 : -1 })
                .skip(start)
                .limit(end - start + 1);

            const [items, total] = await Promise.all([
                query.exec(),
                User.countDocuments(parsedFilter)
            ]);

            const data = items.map(item => ({
                id: item.ID || item._id.toString(),
                ...item.toObject(),
                purchasesCount: item.PURCHASES?.length || 0
            }));

            res.set({
                'Content-Range': `users ${start}-${start + items.length - 1}/${total}`,
                'Access-Control-Expose-Headers': 'Content-Range'
            });
            
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            res.json({
                id: user._id,
                ...user.toObject(),
                purchasesCount: user.PURCHASES?.length || 0
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

// Контроллер для TON операций
const tonController = {
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
            res.status(500).json({ error: error.message });
        }
    },

    async getUserWithdrawals(req, res) {
    try {
        const userId = req.params.userId.toString(); // Приводим к строке
        console.log(`Поиск выводов для user_id (строка): ${userId}`);

        const withdrawals = await TonWithdraw.find({ 
            user_id: userId // Ищем по строке, а не ObjectId
        }).sort({ created_at: -1 });

        console.log('Результат запроса:', withdrawals);
        
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

// ====================== Маршруты ======================

// Пользователи
app.get('/api/users', userController.list);
app.get('/api/users/:id', userController.getOne);

// TON операции
app.get('/api/users/:userId/ton/deposits', tonController.getUserDeposits);
app.get('/api/users/:userId/ton/withdrawals', tonController.getUserWithdrawals);
app.get('/api/users/:userId/ton/summary', tonController.getTonSummary);

// Стандартные CRUD маршруты для других ресурсов
const resources = [
    { route: 'withdraws', model: Withdraw },
    { route: 'transactions', model: Transaction },
    { route: 'manufacture_user', model: ManufactureUser },
    { route: 'coinages', model: Coinage },
    { route: 'user_dwarves', model: UserDwarfs },
    { route: 'tools', model: Tool },
    { route: 'trolleys', model: Trolley },
    { route: 'deposits', model: Deposit },
    { route: 'stocks', model: Stock },
    { route: 'mails', model: Mail },
    { route: 'offers', model: Offer },
    { route: 'dwarves', model: Dwarf }
];

resources.forEach(({ route, model }) => {
    const controller = createStandardController(model, route);
    app.get(`/api/${route}`, controller.list);
    app.get(`/api/${route}/:id`, controller.getOne);
    app.post(`/api/${route}`, controller.create);
    app.put(`/api/${route}/:id`, controller.update);
    app.delete(`/api/${route}/:id`, controller.delete);
});

// Статистика и аналитика
app.get('/api/stats/system', async (req, res) => {
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

// ====================== Запуск сервера ======================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log('Available REST API endpoints:');
    console.log('- GET /api/users');
    console.log('- GET /api/users/:id');
    console.log('- GET /api/users/:userId/ton/deposits');
    console.log('- GET /api/users/:userId/ton/withdrawals');
    console.log('- GET /api/users/:userId/ton/summary');
    resources.forEach(({ route }) => {
        console.log(`- CRUD /api/${route}`);
    });
    console.log('- GET /api/stats/system');
});