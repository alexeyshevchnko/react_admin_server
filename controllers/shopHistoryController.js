import { Stock, ShopStockHistory } from '../models/index.js';

export const getUserShopHistoryDetailed = async (req, res) => {
  try {
    const userId = req.params.user_id;

    if (!userId) {
        return res.status(400).json({ error: 'user_id is required' });
    }

    // 1. Получаем историю покупок пользователя
    const history = await ShopStockHistory.find({ user_id: userId });

    if (!history.length) {
      return res.json([]);
    }

    const salesIds = history.map(h => h.sales_id);

    // 2. Получаем соответствующие stock-записи
    const stocks = await Stock.find({ 'sales.salesId': { $in: salesIds } });

    // 3. Мапа salesId -> нужный фрагмент stock
    const stockMap = new Map();

    for (const stock of stocks) {
      for (const sale of stock.sales) {
        if (salesIds.includes(sale.salesId) && !stockMap.has(sale.salesId)) {
          stockMap.set(sale.salesId, {
            _id: stock._id,
            all_amount: stock.all_amount,
            sold_amount: stock.sold_amount,
            sale_amount: stock.sale_amount,
            type: stock.type,
            stock_income_percent: stock.stock_income_percent,
            sale_price: stock.sale_price,
            sales: [sale], // только нужная продажа
            income_mmt_all: stock.income_mmt_all,
          });
        }
      }
    }

    // 4. Собираем финальный массив
    const result = history.map(entry => ({
      user_id: entry.user_id,
      amount: entry.amount,
      sales_id: stockMap.get(entry.sales_id) || null, // если не найден — null
    }));

    return res.json(result);
  } catch (error) {
    console.error('getUserShopHistoryDetailed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
