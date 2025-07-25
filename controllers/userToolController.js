import { User ,UserTool, UserToolMarketOffer } from '../models/index.js';

/**
 * Получить инструменты пользователя
 */
export const getTools = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      page = 1,
      limit = 10,
      _sort = 'created_at',
      _order = 'DESC'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [_sort]: _order === 'DESC' ? -1 : 1 };

    const [tools, total] = await Promise.all([
      UserTool.find({ user_id: userId })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      UserTool.countDocuments({ user_id: userId })
    ]);

    res.json({
      data: tools,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Получить предложения, где пользователь — покупатель, включая данные о продавцах
 */
export const getBuyer = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const {
      page = 1,
      limit = 10,
      _sort = 'created_at',
      _order = 'DESC'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [_sort]: _order === 'DESC' ? -1 : 1 };

    const [purchases, total] = await Promise.all([
      UserToolMarketOffer.find({ buyer_user_id: buyerId })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      UserToolMarketOffer.countDocuments({ buyer_user_id: buyerId })
    ]);

    const salesmanIds = [...new Set(purchases.map(p => p.salesman_user_id).filter(Boolean))];

    const salesmen = await User.find({ ID: { $in: salesmanIds } })
      .select('_id ID')
      .lean();

    const salesmanMap = Object.fromEntries(salesmen.map(s => [s.ID, s]));

    const enrichedPurchases = purchases.map(p => ({
      ...p,
      salesman_user: salesmanMap[p.salesman_user_id] || null
    }));

    res.json({
      data: enrichedPurchases,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/**
 * Получить предложения, где пользователь — продавец, включая данные о покупателях
 */
export const getSalesman = async (req, res) => {
  try {
    const { salesmanId } = req.params;
    const {
      page = 1,
      limit = 10,
      _sort = 'created_at',
      _order = 'DESC'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [_sort]: _order === 'DESC' ? -1 : 1 };

    const [offers, total] = await Promise.all([
      UserToolMarketOffer.find({ salesman_user_id: salesmanId })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      UserToolMarketOffer.countDocuments({ salesman_user_id: salesmanId })
    ]);

    // Собираем ID покупателей
    const buyerIds = [...new Set(offers.map(o => o.buyer_user_id).filter(Boolean))];

    // Получаем покупателей
    const buyers = await User.find({ ID: { $in: buyerIds } })
      .select('_id ID')
      .lean();

    const buyerMap = Object.fromEntries(buyers.map(b => [b.ID, b]));

    // Обогащаем офферы данными о покупателях
    const enrichedOffers = offers.map(offer => ({
      ...offer,
      buyer_user: buyerMap[offer.buyer_user_id] || null
    }));

    res.json({
      data: enrichedOffers,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};