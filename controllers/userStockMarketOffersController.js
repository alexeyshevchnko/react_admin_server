import { UserStockMarketOffer, User, UserStock, Stock } from '../models/index.js';

export const getOffersBySalesman = async (req, res) => {
  try {
    const { salesmanId } = req.params;

    const offers = await UserStockMarketOffer
      .find({ salesman_user_id: salesmanId })
      .sort({ created_at: -1 }) // <-- сортировка по времени в порядке убывания
      .lean();

    const userStockIds = offers.map(o => o.user_stock_id);
    const userStocks = await UserStock.find({ _id: { $in: userStockIds } }).lean();
    const stockIds = userStocks.map(us => us.stock_id);

    const stocks = await Stock.find({ _id: { $in: stockIds } }).lean();
    const stockMap = Object.fromEntries(stocks.map(s => [s._id.toString(), s]));

    const userStocksWithStock = userStocks.map(us => ({
      ...us,
      stock_id: stockMap[us.stock_id.toString()] || null,
    }));
    const userStocksMap = Object.fromEntries(userStocksWithStock.map(us => [us._id.toString(), us]));

    const buyerIds = [...new Set(offers.map(o => o.buyer_user_id).filter(Boolean))];
    const buyers = await User.find({ ID: { $in: buyerIds } }).select('_id ID').lean();
    const buyersMap = Object.fromEntries(buyers.map(b => [b.ID, { _id: b._id, ID: b.ID }]));

    const enrichedOffers = offers.map(o => ({
      ...o,
      user_stock_id: userStocksMap[o.user_stock_id.toString()] || null,
      buyer_user_id: o.buyer_user_id ? buyersMap[o.buyer_user_id] || null : null,
    }));

    res.json(enrichedOffers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPurchasesByBuyer = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const purchases = await UserStockMarketOffer
      .find({ buyer_user_id: buyerId })
      .sort({ created_at: -1 }) // <-- сортировка по времени в порядке убывания
      .lean();

    const userStockIds = purchases.map(p => p.user_stock_id);
    const userStocks = await UserStock.find({ _id: { $in: userStockIds } }).lean();
    const stockIds = userStocks.map(us => us.stock_id);

    const stocks = await Stock.find({ _id: { $in: stockIds } }).lean();
    const stockMap = Object.fromEntries(stocks.map(s => [s._id.toString(), s]));

    const userStocksWithStock = userStocks.map(us => ({
      ...us,
      stock_id: stockMap[us.stock_id.toString()] || null,
    }));
    const userStocksMap = Object.fromEntries(userStocksWithStock.map(us => [us._id.toString(), us]));

    const salesmanIds = [...new Set(purchases.map(p => p.salesman_user_id))];
    const salesmen = await User.find({ ID: { $in: salesmanIds } }).select('_id ID').lean();
    const salesmenMap = Object.fromEntries(salesmen.map(s => [s.ID, { _id: s._id, ID: s.ID }]));

    const enrichedPurchases = purchases.map(p => ({
      ...p,
      user_stock_id: userStocksMap[p.user_stock_id.toString()] || null,
      salesman_user_id: salesmenMap[p.salesman_user_id] || null,
    }));

    res.json(enrichedPurchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
